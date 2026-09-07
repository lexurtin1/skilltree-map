(function () {
  const TEAL = '#2F9B8E', AMBER = '#D99A3E', CRIM = '#C4675F', SLATE = '#8CA3BC';
  const TEXT = { [TEAL]: '#1F6D63', [AMBER]: '#8A5E12', [CRIM]: '#96453E', [SLATE]: '#5A7391' };
  const CITY = {
    London: [-0.1278, 51.5074], Dublin: [-6.2603, 53.3498], Luxembourg: [6.1319, 49.6116],
    Frankfurt: [8.6821, 50.1109], Milan: [9.19, 45.4642], Paris: [2.3522, 48.8566],
    Madrid: [-3.7038, 40.4168], Zurich: [8.5417, 47.3769], Amsterdam: [4.9041, 52.3676],
    Vienna: [16.3738, 48.2082], Stockholm: [18.0686, 59.3293], Copenhagen: [12.5683, 55.6761],
    Oslo: [10.7522, 59.9139], Helsinki: [24.9384, 60.1699]
  };

  const ACCOUNTS = [
    { id: 'fid', name: 'Fidelity International', short: 'Fidelity', hq: 'London', rev: 8.4, state: TEAL,
      overnight: 'Distribution filing at 08:12 — new markets indicated',
      funds: [
        { name: 'Global Dividend SICAV', dom: 'Luxembourg', aum: '£3.1bn', to: ['London', 'Frankfurt', 'Milan'] },
        { name: 'Emerging Markets ICAV', dom: 'Dublin', aum: '£1.4bn', to: ['Zurich', 'Amsterdam'] }
      ] },
    { id: 'nor', name: 'Nordea Asset Management', short: 'Nordea', hq: 'Stockholm', rev: 5.2, state: TEAL,
      overnight: 'Two distribution partners replaced in the Nordics',
      funds: [
        { name: 'Nordic Equity SICAV', dom: 'Luxembourg', aum: '£2.2bn', to: ['Stockholm', 'Oslo', 'Helsinki', 'Copenhagen'] },
        { name: 'Euro Credit Fund', dom: 'Luxembourg', aum: '£0.8bn', to: ['Frankfurt', 'Amsterdam'] }
      ] },
    { id: 'mg', name: 'M&G Investments', short: 'M&G', hq: 'London', rev: 7.1, state: CRIM,
      overnight: 'Third delivery ticket still open — renews 29 Sep',
      funds: [
        { name: 'Optimal Income SICAV', dom: 'Luxembourg', aum: '£4.6bn', to: ['Milan', 'Madrid', 'Paris'] },
        { name: 'UK Income Trust', dom: 'London', aum: '£1.1bn', to: ['London'] }
      ] },
    { id: 'sch', name: 'Schroders', short: 'Schroders', hq: 'London', rev: 4.6, state: AMBER,
      overnight: 'Deal unchanged for three weeks — no senior sponsor',
      funds: [
        { name: 'Global Cities Real Estate', dom: 'Luxembourg', aum: '£1.9bn', to: ['Frankfurt', 'Vienna', 'Zurich'] }
      ] },
    { id: 'jan', name: 'Janus Henderson Investors', short: 'Janus Henderson', hq: 'London', rev: 3.4, state: AMBER,
      overnight: 'Quiet for seven weeks since the CIO change',
      funds: [
        { name: 'Horizon Euro Corporate', dom: 'Luxembourg', aum: '£1.2bn', to: ['Paris', 'Milan'] },
        { name: 'Pan European Alpha', dom: 'Dublin', aum: '£0.6bn', to: ['Amsterdam', 'Copenhagen'] }
      ] },
    { id: 'way', name: 'Waystone', short: 'Waystone', hq: 'Dublin', rev: 2.8, state: SLATE,
      overnight: 'Nothing changed since yesterday',
      funds: [
        { name: 'Managed Platform ICAV', dom: 'Dublin', aum: '£0.9bn', to: ['London', 'Luxembourg'] }
      ] }
  ];

  const EUROPE = { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[-11, 35.5], [28, 35.5], [28, 63.5], [-11, 63.5], [-11, 35.5]]] } };

  let landPromise = null;
  function land() {
    if (!landPromise) {
      landPromise = fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json')
        .then(r => r.json())
        .then(t => window.topojson.feature(t, t.objects.countries));
    }
    return landPromise;
  }

  function ready() {
    return new Promise(res => {
      const tick = () => (window.d3 && window.topojson) ? res() : setTimeout(tick, 40);
      tick();
    });
  }

  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  class GIMap extends HTMLElement {
    static get observedAttributes() { return ['selected']; }

    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this.style.display = 'block';
      this.innerHTML = '<div data-root style="display:flex;flex-wrap:wrap;gap:20px;align-items:stretch"><div data-left style="display:flex;flex-direction:column;gap:8px;flex:1 1 460px;min-width:0"><div data-map style="position:relative;flex:1;min-height:380px;border-radius:18px;background:linear-gradient(160deg,rgba(255,255,255,0.55),rgba(207,226,247,0.35));border:1px solid rgba(255,255,255,0.9);overflow:hidden"><div data-tools style="position:absolute;bottom:12px;right:12px;z-index:2;display:flex;gap:6px"></div></div><div data-caption style="font:400 12px/1.5 \'Open Sans\',sans-serif;color:#5A7391">Dot = account head office · filled circle = selected account · square = country the fund is registered in · line = city the fund is sold in</div></div><div data-panel style="flex:1 1 280px;max-width:380px;min-width:0"></div></div>';
      this._mapEl = this.querySelector('[data-map]');
      this._panelEl = this.querySelector('[data-panel]');
      if (window.matchMedia && window.matchMedia('(max-width: 860px)').matches) {
        this.querySelector('[data-root]').style.gridTemplateColumns = 'minmax(0,1fr)';
      }
      this._sel = this.getAttribute('selected') || 'fid';
      this._t = { k: 1, x: 0, y: 0 };
      this._tools();
      this._applyLayout();
      this._onKey = e => { if (e.key === 'Escape' && this._big) this._toggleExpand(); };
      document.addEventListener('keydown', this._onKey);
      ready().then(() => land()).then(l => { this._land = l; this._draw(); this._panel(); });
      this._ro = new ResizeObserver(() => { if (this._land) this._draw(); });
      this._ro.observe(this._mapEl);
    }

    disconnectedCallback() {
      if (this._ro) this._ro.disconnect();
      if (this._onKey) document.removeEventListener('keydown', this._onKey);
    }

    attributeChangedCallback(n, o, v) {
      if (n === 'selected' && v && v !== this._sel) {
        this._sel = v;
        if (this._land) { this._draw(); this._panel(); }
      }
    }

    _select(id) {
      if (id === this._sel) return;
      this._sel = id;
      this.setAttribute('selected', id);
      this._draw(); this._panel();
      this.dispatchEvent(new CustomEvent('gi-account-select', { detail: { id }, bubbles: true, composed: true }));
    }

    _tools() {
      const box = this.querySelector('[data-tools]');
      const btn = (label, title) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.title = title;
        b.textContent = label;
        b.style.cssText = 'font:600 13px/1 "Open Sans",sans-serif;color:#123457;background:rgba(255,255,255,0.86);border:1px solid rgba(10,37,64,0.1);border-radius:9px;min-width:30px;height:30px;padding:0 9px;cursor:pointer;backdrop-filter:blur(8px)';
        box.appendChild(b);
        return b;
      };
      btn('+', 'Zoom in').addEventListener('click', () => this._zoomBy(1.5));
      btn('\u2212', 'Zoom out').addEventListener('click', () => this._zoomBy(1 / 1.5));
      btn('Reset', 'Reset the view').addEventListener('click', () => this._zoomTo({ k: 1, x: 0, y: 0 }));
      this._expandBtn = btn('Expand', 'Expand the map');
      this._expandBtn.addEventListener('click', () => this._toggleExpand());
    }

    _zoomTo(t) {
      this._t = t;
      if (this._zb && this._svg) {
        this._svg.call(this._zb.transform, window.d3.zoomIdentity.translate(t.x, t.y).scale(t.k));
      } else if (this._land) { this._draw(); }
    }

    _zoomBy(f) {
      const W = this._mapEl.clientWidth || 640, H = this._mapEl.clientHeight || 420;
      const t = this._t, k = Math.max(1, Math.min(8, t.k * f));
      const cx = W / 2, cy = H / 2;
      this._zoomTo({ k, x: cx - (cx - t.x) * (k / t.k), y: cy - (cy - t.y) * (k / t.k) });
    }

    _toggleExpand() {
      this._big = !this._big;
      this._applyLayout();
      requestAnimationFrame(() => { if (this._land) this._draw(); });
    }

    _applyLayout() {
      const root = this.querySelector('[data-root]');
      const narrow = window.matchMedia && window.matchMedia('(max-width: 860px)').matches;
      this.style.display = 'block';
      const panel = this.querySelector('[data-panel]');
      if (panel) panel.style.maxWidth = this._big ? '100%' : '380px';
      if (root) root.style.flexDirection = (this._big || narrow) ? 'column' : 'row';
      if (this._expandBtn) this._expandBtn.textContent = this._big ? 'Shrink' : 'Expand';
    }

    _draw() {
      const d3 = window.d3;
      this._applyLayout();
      const W = Math.max(320, this._mapEl.clientWidth || 640);
      const H = this._big
        ? Math.max(520, Math.round((window.innerHeight || 900) * 0.78))
        : Math.max(380, Math.min(560, Math.round(W * 0.66)));
      this._mapEl.style.height = H + 'px';

      const fitTo = { type: 'MultiPoint', coordinates: Object.keys(CITY).map(k => CITY[k]) };
      const padX = Math.min(150, Math.max(76, Math.round(W * 0.24)));
      const proj = d3.geoMercator().fitExtent([[padX, 74], [W - padX, H - 62]], fitTo);
      const zt = this._t || { k: 1, x: 0, y: 0 };
      const s0 = proj.scale(), tr0 = proj.translate();
      proj.scale(s0 * zt.k).translate([tr0[0] * zt.k + zt.x, tr0[1] * zt.k + zt.y]);
      const path = d3.geoPath(proj);
      const acc = ACCOUNTS.find(a => a.id === this._sel) || ACCOUNTS[0];

      const svg = d3.select(this._mapEl).selectAll('svg').data([0]);
      const svgEl = svg.enter().append('svg').merge(svg)
        .attr('width', W).attr('height', H)
        .attr('viewBox', '0 0 ' + W + ' ' + H)
        .style('display', 'block')
        .style('cursor', 'grab');
      svgEl.selectAll('*').remove();
      this._svg = svgEl;
      if (!this._zb) {
        this._zb = d3.zoom().scaleExtent([1, 8]).on('zoom', ev => {
          const t = ev.transform;
          this._t = { k: t.k, x: t.x, y: t.y };
          this._draw();
        });
        svgEl.call(this._zb);
      }

      const g = svgEl.append('g');
      g.selectAll('path.country').data(this._land.features).enter().append('path')
        .attr('class', 'country').attr('d', path)
        .attr('fill', 'rgba(10,37,64,0.075)')
        .attr('stroke', 'rgba(255,255,255,0.95)')
        .attr('stroke-width', 1);

      const arcs = g.append('g');
      const pts = g.append('g');

      // distribution arcs for the selected account
      const domCities = {};
      acc.funds.forEach(f => {
        const from = proj(CITY[f.dom]);
        domCities[f.dom] = from;
        f.to.forEach(city => {
          const to = proj(CITY[city]);
          if (!from || !to) return;
          const dx = to[0] - from[0], dy = to[1] - from[1];
          const len = Math.hypot(dx, dy) || 1;
          const bow = Math.min(60, len * 0.28);
          const mx = (from[0] + to[0]) / 2 - (dy / len) * bow;
          const my = (from[1] + to[1]) / 2 + (dx / len) * bow;
          arcs.append('path')
            .attr('d', 'M' + from[0] + ',' + from[1] + ' Q' + mx + ',' + my + ' ' + to[0] + ',' + to[1])
            .attr('fill', 'none').attr('stroke', acc.state).attr('stroke-width', 1.4)
            .attr('stroke-linecap', 'round').attr('opacity', 0.8)
            .attr('stroke-dasharray', '5 6')
            .style('animation', 'gi-flow 2.6s linear infinite');
          pts.append('circle').attr('cx', to[0]).attr('cy', to[1]).attr('r', 3.4)
            .attr('fill', '#fff').attr('stroke', acc.state).attr('stroke-width', 1.6);
          pts.append('text').attr('x', to[0]).attr('y', to[1] - 8)
            .attr('text-anchor', 'middle').attr('font-family', "'Open Sans',sans-serif")
            .attr('font-size', 10.5).attr('fill', TEXT[acc.state]).text(city);
        });
      });

      Object.keys(domCities).forEach(city => {
        const p = domCities[city];
        pts.append('rect').attr('x', p[0] - 4.5).attr('y', p[1] - 4.5).attr('width', 9).attr('height', 9)
          .attr('rx', 2).attr('fill', acc.state).attr('stroke', '#fff').attr('stroke-width', 1.4);
        pts.append('text').attr('x', p[0]).attr('y', p[1] - 12)
          .attr('text-anchor', 'middle').attr('font-family', "'Open Sans',sans-serif")
          .attr('font-size', 10.5).attr('font-weight', 600).attr('fill', TEXT[acc.state])
          .text(city + ' · domicile');
      });

      // one dot per HQ city; hover expands a cluster, non-selected accounts recede
      const byCity = {};
      ACCOUNTS.forEach(a => { (byCity[a.hq] = byCity[a.hq] || []).push(a); });
      const hoverCity = this._hover;

      Object.keys(byCity).forEach(city => {
        const base = proj(CITY[city]);
        const list = byCity[city];
        const hasSel = list.some(a => a.id === acc.id);
        const expanded = list.length === 1 || hasSel || hoverCity === city;
        const west = base[0] < W * 0.52;
        const sx = base[0] + (west ? -58 : 58);
        const step = 30;
        const y0 = base[1] - ((list.length - 1) * step) / 2;
        const cityDim = hasSel ? 1 : 0.4;

        pts.append('circle').attr('cx', base[0]).attr('cy', base[1]).attr('r', 3.2)
          .attr('fill', '#33506F').attr('opacity', 0.5 * cityDim);
        pts.append('text').attr('x', base[0]).attr('y', base[1] + 16)
          .attr('text-anchor', 'middle').attr('font-family', "'Open Sans',sans-serif")
          .attr('font-size', 10.5).attr('fill', '#5A7391').attr('opacity', cityDim).text(city);

        if (!expanded) {
          const gg = pts.append('g').style('cursor', 'pointer');
          gg.append('path').attr('d', 'M' + base[0] + ',' + base[1] + ' L' + sx + ',' + base[1])
            .attr('stroke', 'rgba(10,37,64,0.18)').attr('stroke-width', 1).attr('fill', 'none');
          gg.append('circle').attr('cx', sx).attr('cy', base[1]).attr('r', 13)
            .attr('fill', 'rgba(255,255,255,0.92)').attr('stroke', 'rgba(10,37,64,0.22)').attr('stroke-width', 1.4);
          gg.append('text').attr('x', sx).attr('y', base[1] + 4).attr('text-anchor', 'middle')
            .attr('font-family', "'Open Sans',sans-serif").attr('font-size', 11.5).attr('font-weight', 700)
            .attr('fill', '#33506F').attr('opacity', 0.75).text(list.length);
          gg.append('text').attr('x', sx + (west ? -21 : 21)).attr('y', base[1] + 4)
            .attr('text-anchor', west ? 'end' : 'start')
            .attr('font-family', "'Open Sans',sans-serif").attr('font-size', 11.5)
            .attr('fill', '#5A7391').text(list.length + ' accounts');
        } else {
          list.forEach((a, i) => {
            const on = a.id === acc.id;
            const dim = on ? 1 : 0.3;
            const r = on ? 11 : 8;
            const cy = list.length === 1 ? base[1] : y0 + i * step;
            const gg = pts.append('g').style('cursor', 'pointer').attr('opacity', dim)
              .on('click', () => this._select(a.id));
            gg.append('path')
              .attr('d', 'M' + base[0] + ',' + base[1] + ' L' + sx + ',' + cy)
              .attr('stroke', 'rgba(10,37,64,0.22)').attr('stroke-width', 1).attr('fill', 'none');
            if (on) {
              gg.append('circle').attr('cx', sx).attr('cy', cy).attr('r', r + 8)
                .attr('fill', a.state).attr('opacity', 0.15);
            }
            gg.append('circle').attr('cx', sx).attr('cy', cy).attr('r', r)
              .attr('fill', on ? a.state : 'rgba(255,255,255,0.92)')
              .attr('stroke', on ? '#fff' : a.state)
              .attr('stroke-width', on ? 2 : 1.8);
            gg.append('text').attr('x', sx + (west ? -(r + 8) : r + 8)).attr('y', cy + 4)
              .attr('text-anchor', west ? 'end' : 'start')
              .attr('font-family', "'Open Sans',sans-serif")
              .attr('font-size', on ? 12.5 : 11.5).attr('font-weight', on ? 700 : 600)
              .attr('fill', on ? '#0A2540' : '#33506F').text(a.short);
          });
        }

        if (list.length > 1) {
          const hy = expanded ? ((list.length - 1) * step) / 2 + 26 : 26;
          pts.append('rect')
            .attr('x', Math.min(base[0], sx) - 90).attr('y', base[1] - hy)
            .attr('width', Math.abs(sx - base[0]) + 180).attr('height', hy * 2)
            .attr('fill', 'transparent').style('pointer-events', 'all')
            .style('cursor', 'pointer')
            .on('mouseenter', () => { if (this._hover !== city) { this._hover = city; this._draw(); } })
            .on('mouseleave', () => { if (this._hover === city) { this._hover = null; this._draw(); } });
        }
      });
    }

    _panel() {
      const acc = ACCOUNTS.find(a => a.id === this._sel) || ACCOUNTS[0];
      const t = TEXT[acc.state];
      const rows = acc.funds.map(f => (
        '<div style="padding:13px 14px;border-radius:14px;background:rgba(255,255,255,0.62);border:1px solid rgba(255,255,255,0.9)">' +
          '<div style="display:flex;align-items:baseline;gap:10px"><span style="flex:1;font-size:13.5px;font-weight:600;line-height:1.4;color:#123457">' + esc(f.name) + '</span>' +
          '<span style="flex:none;font-size:12px;color:#5A7391">' + esc(f.aum) + '</span></div>' +
          '<div style="font-size:12px;color:#5A7391;margin-top:4px">Domiciled in ' + esc(f.dom) + '</div>' +
          '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:9px">' +
            f.to.map(c => '<span style="font-size:11.5px;color:' + t + ';background:rgba(255,255,255,0.9);border:1px solid ' + acc.state + '44;border-radius:999px;padding:4px 10px">' + esc(c) + '</span>').join('') +
          '</div>' +
        '</div>'
      )).join('');

      const others = ACCOUNTS.filter(a => a.id !== acc.id).map(a => (
        '<span data-pick="' + a.id + '" style="cursor:pointer;font-size:12px;color:#33506F;background:rgba(255,255,255,0.6);border:1px solid rgba(10,37,64,0.08);border-radius:999px;padding:5px 11px">' +
          '<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:' + a.state + ';margin-right:6px"></span>' + esc(a.short) + '</span>'
      )).join('');

      this._panelEl.innerHTML =
        '<div style="display:flex;flex-direction:column;gap:12px;height:100%">' +
          '<div>' +
            '<div style="font-size:11.5px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#5A7391">Changed since yesterday · ' + esc(acc.short) + '</div>' +
            '<div style="font-size:18px;font-weight:400;color:#0A2540;line-height:1.35;margin-top:6px">' + esc(acc.overnight) + '</div>' +
            '<div style="font-size:12.5px;color:#5A7391;margin-top:6px">HQ ' + esc(acc.hq) + ' · £' + acc.rev + 'm with us · ' + acc.funds.length + ' sub-fund' + (acc.funds.length > 1 ? 's' : '') + '</div>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;gap:8px">' + rows + '</div>' +
          '<div style="margin-top:auto;padding-top:12px;border-top:1px solid rgba(10,37,64,0.08)">' +
            '<div style="font-size:12px;color:#5A7391;margin-bottom:8px">Look at another account</div>' +
            '<div style="display:flex;flex-wrap:wrap;gap:6px">' + others + '</div>' +
          '</div>' +
        '</div>';

      this._panelEl.querySelectorAll('[data-pick]').forEach(el => {
        el.addEventListener('click', () => this._select(el.getAttribute('data-pick')));
      });
    }
  }

  if (!customElements.get('gi-map')) customElements.define('gi-map', GIMap);
})();
