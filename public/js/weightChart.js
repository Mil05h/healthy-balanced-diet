const ctx = document.getElementById('weightChart');

let labels = [];

for (let i = 0; i < user.measures.length; i++) {
    labels.unshift(user.measures[i].createdAt.slice(0, 10))
}

let weight = []

for (let i = 0; i < user.measures.length; i++) {
    weight.unshift(user.measures[i].weight)
}



const imageBg = new Image();
imageBg.src = '/images/logoTsp.png';

const plugin = {
    id: 'custom_canvas_background_image',
    beforeDraw: (chart) => {
        if (imageBg.complete) {
            const ctx = chart.ctx;
            const { top, left, width, height } = chart.chartArea;
            const x = left + width / 2 - imageBg.width / 2;
            const y = top + height / 2 - imageBg.height / 2;
            imageBg.setAttribute('crossorigin', 'anonymous');
            ctx.drawImage(imageBg, x, y);
        } else {
            imageBg.onload = () => chart.draw();
        }
    }
};

const lbl = user.unit === 'metric' ? 'kg' : 'pounds';

const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;
const down = (ctx, value) => ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;
const data = {
    labels: labels,
    datasets: [{
        label: lbl,
        borderColor: '#ff6666',
        // backgroundColor:"#38b91c",
        data: weight,
        segment: {
            borderColor: ctx => skipped(ctx, 'rgb(0,0,0,0.2)') || down(ctx, '#38b91c'),
            borderDash: ctx => skipped(ctx, [6, 6]),
        },
        spanGaps: true
    }]
};

const config = {
    type: 'line',
    data: data,
    options: {
        fill: false,
        interaction: {
            intersect: false
        },
        radius: 0,
        bezierCurve: false,
        plugins: {
            legend: {
                display: false
            },
            // zoom: {
            //     zoom: {
            //         wheel: {
            //             enabled: true,
            //         },
            //         pinch: {
            //             enabled: true
            //         },
            //         mode: 'xy',
            //     }
            // },
        },
    },
    plugins: [plugin]
};


const weightChart = new Chart(ctx.getContext('2d'), config);

function download() {
    const imgLink = document.createElement('a');
    imgLink.download = 'canvas.png';
    imgLink.crossOrigin = 'Anonymous';
    imgLink.href = ctx.toDataURL();
    imgLink.click()
}

