// Here is the starting point for your application code.

// Small helpers you might want to keep
import './helpers/context_menu.js';
import './helpers/external_links.js';

import Leap from 'leapjs';
import { vec3 } from 'gl-matrix';

const scaled = (angle, min = 0.0, max = Math.PI) => (((angle - min) / (max - min)));
const degrees = angle => ((angle * 180 / Math.PI));
const angle = (v1, v2) => ((Math.PI - vec3.angle(v1, v2)).toPrecision(2));

window.onload = function() {
  const robot = io('http://192.168.1.74:3000/api/robots/H725');

  robot.emit('setPWMFreq', 100);

  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].forEach(i => {
    robot.emit('setAngle', i, 90);
  });

  Leap.plugin('fingersAngles', function () {
    return {
      hand: function (hand) {
        hand.fingersAngles = hand.fingers
          .map(function (finger) {
            const type = finger.type;
            const metacarpal = finger.metacarpal;
            const proximal = finger.proximal;
            const medial = finger.medial;
            const distal = finger.distal;

            const alpha = Math.floor(degrees(scaled(angle(metacarpal.direction(), proximal.direction()), Math.PI/3) * 3));
            const beta = Math.floor(degrees(scaled(angle(proximal.direction(), medial.direction()), Math.PI/3) * 3));
            const gamma = Math.floor(degrees(scaled(angle(medial.direction(), distal.direction()), Math.PI/3) * 3));

            return {
              type: type,
              alpha: alpha,
              beta: beta,
              gamma: gamma
            };
          });
      }
    };
  });

  const controllerOptions = {
    host: '127.0.0.1',
    port: 6437,
    enableGestures: false,
    frameEventName: 'deviceFrame',
    useAllPlugins: false,
  };
  const controller = new Leap.Controller(controllerOptions)
    .use('fingersAngles')
    .on('connect', () => {
      setInterval(() => {
        const hands = controller.frame().hands;

        if (hands.length) {
          // [{ type, alpha, beta, gamma }, ...]
          const [thumb, index, middle, ring, pinkie] = hands[0].fingersAngles;

          console.log(thumb.alpha);
          console.log(thumb.beta);
          console.log(thumb.gamma);
          console.log(index.alpha);
          console.log(index.beta);
          console.log(index.gamma);
          console.log(middle.alpha);
          console.log(middle.beta);
          console.log(middle.gamma);
          console.log(ring.alpha);
          console.log(ring.beta);
          console.log(ring.gamma);
          console.log(index.alpha);
          console.log(index.beta);
          console.log(index.gamma);

          robot.emit('setAngle', 0, thumb.alpha);
          robot.emit('setAngle', 1, thumb.beta);
          robot.emit('setAngle', 2, thumb.gamma);
          robot.emit('setAngle', 3, index.alpha);
          robot.emit('setAngle', 4, index.beta);
          robot.emit('setAngle', 5, index.gamma);
          robot.emit('setAngle', 6, middle.alpha);
          robot.emit('setAngle', 7, middle.beta);
          robot.emit('setAngle', 8, middle.gamma);
          robot.emit('setAngle', 9, ring.alpha);
          robot.emit('setAngle', 10, ring.beta);
          robot.emit('setAngle', 11, ring.gamma);
          robot.emit('setAngle', 12, index.alpha);
          robot.emit('setAngle', 13, index.beta);
          robot.emit('setAngle', 14, index.gamma)
        }
      }, 250);
    })
    .connect();
}

