// Minimal canvas line chart (replaces flot, jQuery and Chart.js, which were
// loaded only to draw two simple graphs).
core.factory('LineChart', function() {
    const AXIS = 'rgba(0, 0, 0, 0.45)';
    const GRID = 'rgba(0, 0, 0, 0.06)';
    const BORDER = 'rgb(82, 167, 224)';

    // Sizes the backing store for the device pixel ratio. The CSS size is read once
    // (the canvas may be hidden, i.e. 0×0, on later draws).
    const prepare = (canvas) => {
        const dpr = window.devicePixelRatio || 1;
        if (!canvas.dataset.cssW) {
            canvas.dataset.cssW = canvas.clientWidth || canvas.width;
            canvas.dataset.cssH = canvas.clientHeight || canvas.height;
        }
        const cssW = Number(canvas.dataset.cssW);
        const cssH = Number(canvas.dataset.cssH);
        if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
            canvas.style.width = cssW + 'px';
            canvas.style.height = cssH + 'px';
            canvas.width = Math.round(cssW * dpr);
            canvas.height = Math.round(cssH * dpr);
        }
        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { ctx, w: cssW, h: cssH };
    };

    const niceTicks = (min, max, count) => {
        const step = Math.pow(10, Math.floor(Math.log10((max - min) / count)));
        const err = (count * step) / (max - min);
        const nice = step * (err <= 0.15 ? 10 : err <= 0.35 ? 5 : err <= 0.75 ? 2 : 1);
        const ticks = [];
        for (let v = Math.ceil(min / nice) * nice; v <= max + 1e-9; v += nice) ticks.push(Math.round(v * 1000) / 1000);
        return ticks;
    };

    /*
     * opts: {
     *   series: [{ values: number[], color, width }],   // evenly spaced along x
     *   yMin, yMax,                                      // fixed range (expanded to fit data)
     *   xLabel, yLabel,
     * }
     */
    const draw = (canvas, opts) => {
        const { ctx, w, h } = prepare(canvas);
        const pad = { l: opts.yLabel ? 52 : 36, r: 10, t: 10, b: opts.xLabel ? 34 : 10 };
        const plotW = w - pad.l - pad.r;
        const plotH = h - pad.t - pad.b;

        let yMin = opts.yMin;
        let yMax = opts.yMax;
        opts.series.forEach((s) => s.values.forEach((v) => {
            if (v < yMin) yMin = Math.floor(v - 2);
            if (v > yMax) yMax = Math.ceil(v + 2);
        }));
        const y = (v) => pad.t + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

        ctx.clearRect(0, 0, w, h);
        ctx.font = '12px "Source Sans Pro", sans-serif';
        ctx.fillStyle = AXIS;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 1;
        niceTicks(yMin, yMax, 5).forEach((t) => {
            ctx.strokeStyle = GRID;
            ctx.beginPath();
            ctx.moveTo(pad.l, Math.round(y(t)) + 0.5);
            ctx.lineTo(pad.l + plotW, Math.round(y(t)) + 0.5);
            ctx.stroke();
            ctx.fillText(String(t), pad.l - 6, y(t));
        });
        ctx.strokeStyle = BORDER;
        ctx.strokeRect(pad.l + 0.5, pad.t + 0.5, plotW, plotH);

        if (opts.xLabel) {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(opts.xLabel, pad.l + plotW / 2, h - 4);
        }
        if (opts.yLabel) {
            ctx.save();
            ctx.translate(12, pad.t + plotH / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(opts.yLabel, 0, 0);
            ctx.restore();
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(pad.l, pad.t, plotW, plotH);
        ctx.clip();
        opts.series.forEach((s) => {
            const n = s.values.length;
            if (!n) return;
            const dx = n > 1 ? plotW / (n - 1) : 0;
            ctx.strokeStyle = s.color;
            ctx.lineWidth = s.width || 2;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            for (let i = 0; i < n; i++) {
                const px = pad.l + i * dx;
                if (i === 0) ctx.moveTo(px, y(s.values[i]));
                else ctx.lineTo(px, y(s.values[i]));
            }
            ctx.stroke();
        });
        ctx.restore();
    };

    return { draw };
});
