const canvas = document.getElementById("canvas");

console.log(canvas)
canvas.width = innerWidth;
canvas.height = innerHeight;
const ctx = canvas.getContext("2d");
const rc = rough.canvas(document.getElementById('canvas'));

let frames = 0;

let obj = {
    x: 50,
    y: 50,
    w: 80,
    color: "red"
};

const touches = {
    up: false,
    down: false,
    left: false,
    right: false
};

const pow = 4;
const touches_val = {
    up: ["y", -pow],
    down: ["y", pow],
    left: ["x", -pow],
    right: ["x", pow]
};

let draw = setInterval(() => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const roughness = frames === 1 ? 1 : 1;
    rc.circle(obj.x, obj.y, obj.w, { fill: obj.color, roughness: roughness });
    frames++;
    frames %= 3;
}, 25);

let update = setInterval(() => {
    for (let key in touches) {
        if (touches[key]) {
            obj[touches_val[key][0]] += touches_val[key][1];
        }
    }
}, 10);