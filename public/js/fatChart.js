let fatLabels = [];

for (let i = 0; i < user.measures.length; i++) {
    fatLabels.unshift(user.measures[i].createdAt.slice(0, 10))
}

const hghStr = "" + user.height;
const hgh = parseInt(hghStr[0]) * 12 + parseInt(hghStr.slice(1));

const formula = (user) => {
    let fat = []
    if (user.gender === 'male') {
        for (let i = 0; i < user.measures.length; i++) {
            if (user.unit === 'metric') {
                fat.unshift(86.010 * Math.log10(user.measures[i].waist / 2.54 - user.measures[i].neck / 2.54) - 70.041 * Math.log10(user.height / 2.54) + 36.7)
            } else {
                fat.unshift(86.010 * Math.log10(user.measures[i].waist - user.measures[i].neck) - 70.041 * Math.log10(hgh) + 36.7)
            }
        }
    } else {
        for (let i = 0; i < user.measures.length; i++) {
            if (user.unit === 'metric') {
                fat.unshift(163.205 * Math.log10(user.measures[i].waist / 2.54 + user.measures[i].hip / 2.54 - user.measures[i].neck / 2.54) - 97.684 * Math.log10(user.height / 2.54) - 78.387)
            } else {
                fat.unshift(163.205 * Math.log10(user.measures[i].waist + user.measures[i].hip - user.measures[i].neck) - 97.684 * Math.log10(hgh) - 78.387)
            }
        }
    }
    return fat
}

const fat = formula(user);
const fatRounded = fat.map(f => Math.round((f + Number.EPSILON) * 100) / 100);

const fatData = {
    labels: fatLabels,
    datasets: [{
        label: 'Body Fat %',
        borderColor: '#ff6666',
        backgroundColor: "#38b91c",
        data: fatRounded,
        segment: {
            borderColor: ctx => skipped(ctx, 'rgb(0,0,0,0.2)') || down(ctx, '#38b91c'),
            borderDash: ctx => skipped(ctx, [6, 6]),
        },
        spanGaps: true,
        tension: 0.1
    }]
};

const fatConfig = {
    type: 'line',
    data: fatData,
    options: {
        fill: false,
        interaction: {
            intersect: false
        },
        radius: 0,
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
            // }
        }
    },
    plugins: [plugin]
};

const fatChart = new Chart(document.getElementById('fatChart'), fatConfig);

function downloadTwo() {
    const imgLink = document.createElement('a');
    imgLink.download = 'canvass.png';
    imgLink.crossOrigin = 'Anonymous';
    imgLink.href = document.getElementById('fatChart').toDataURL();
    imgLink.click()
}

const fatPrc = document.querySelectorAll("#fatPrc")
const fatReverse = fatRounded.slice(0).reverse()

for (let i = 0; i < fatPrc.length; i++) {
        fatPrc[i].innerText = `Body Fat: ${fatReverse[i]} %`
    }
