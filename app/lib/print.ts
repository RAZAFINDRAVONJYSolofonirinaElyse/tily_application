import type { Membre, FDP, Teknika, FafiEntry } from '@/types'
import { CATS, FIOFANANA_DINGAM } from '@/types'

const BRAND = '#1C3557'

// ── CSS ────────────────────────────────────────────────────────────
function css(ac: string): string {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Lato',Arial,sans-serif;font-size:10.5pt;color:#1a1a1a;background:#f4f6f9}

    /* toolbar */
    .toolbar{
      position:sticky;top:0;z-index:100;
      display:flex;align-items:center;gap:10px;padding:10px 20px;
      background:${ac};border-bottom:3px solid rgba(0,0,0,.15);
      box-shadow:0 2px 10px rgba(0,0,0,.3);
    }
    .toolbar-title{flex:1;font-size:11pt;font-weight:700;color:#fff;
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .tbtn{
      display:inline-flex;align-items:center;gap:6px;
      padding:7px 18px;border-radius:6px;border:none;cursor:pointer;
      font-size:10pt;font-weight:700;font-family:inherit;
      transition:opacity .15s;white-space:nowrap;
    }
    .tbtn:hover{opacity:.82}
    .tbtn-dl{background:#fff;color:${ac}}
    .tbtn-cl{background:rgba(255,255,255,.18);color:#fff;border:1px solid rgba(255,255,255,.3)}

    /* page wrapper */
    .page{padding:20px 24px;max-width:940px;margin:0 auto}

    /* document card */
    .doc{background:#fff;border-radius:10px;box-shadow:0 1px 6px rgba(0,0,0,.1);overflow:hidden}

    /* document header */
    .doc-header{
      display:flex;align-items:center;gap:14px;
      padding:14px 20px;
      background:${ac};
      color:#fff;
    }
    .doc-header img{width:46px;height:46px;object-fit:contain;flex-shrink:0}
    .dhc{flex:1;text-align:center}
    .dhc-org{font-size:8.5pt;opacity:.8;letter-spacing:.05em;margin-bottom:3px}
    .dhc-title{font-size:14pt;font-weight:900;text-transform:uppercase;letter-spacing:.07em;line-height:1.2}
    .dhc-sub{font-size:9pt;opacity:.85;margin-top:4px}

    /* document body */
    .doc-body{padding:18px 20px}

    /* badges */
    .badges{text-align:center;margin-bottom:14px}
    .badge{
      display:inline-block;padding:3px 12px;
      border:1.5px solid ${ac};border-radius:20px;
      font-size:8.5pt;font-weight:700;color:${ac};
      background:${ac}14;
      margin:0 3px 4px;
    }

    /* section title */
    h2{
      font-size:9.5pt;font-weight:700;text-transform:uppercase;letter-spacing:.05em;
      color:${ac};border-bottom:2px solid ${ac};
      padding-bottom:3px;margin:16px 0 8px;
    }

    /* fields */
    .row{display:flex;gap:16px;margin-bottom:7px;flex-wrap:wrap}
    .field{flex:1;min-width:110px}
    .field label{font-size:7.5pt;color:#888;display:block;font-weight:700;
      text-transform:uppercase;letter-spacing:.04em;margin-bottom:2px}
    .field span{font-size:10pt;border-bottom:1.5px solid #ddd;display:block;min-height:18px;padding-bottom:2px}

    /* photo placeholder */
    .photo{
      width:88px;height:108px;border:2px solid ${ac};border-radius:6px;
      float:right;margin-left:16px;
      display:flex;align-items:center;justify-content:center;
      font-size:8pt;color:#bbb;text-align:center;flex-direction:column;
      background:#f7f9fc;gap:4px;
    }

    /* info strip */
    .info-strip{
      display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;
      background:#f7f9fc;padding:9px 12px;border-radius:6px;
      border:1px solid #e5e7eb;margin-bottom:12px;font-size:9.5pt;
    }

    /* table */
    table{width:100%;border-collapse:collapse;margin-top:8px;font-size:9.5pt}
    thead tr{background:${ac};color:#fff}
    th{padding:7px 9px;font-weight:700;font-size:9pt;text-align:left;border:1px solid ${ac}}
    td{padding:5px 9px;border:1px solid #d1d5db}
    tbody tr:nth-child(even){background:#f7f9fc}
    tfoot tr{background:#eef0f3;font-weight:700}
    tfoot td{border:1px solid #bbb}

    /* progress */
    .prog{display:flex;align-items:center;gap:10px;margin-bottom:10px}
    .prog-bar{flex:1;height:9px;background:#e5e7eb;border-radius:5px;overflow:hidden}
    .prog-fill{height:100%;background:${ac};border-radius:5px}
    .prog-pct{font-size:10.5pt;font-weight:700;color:${ac};min-width:36px}

    /* signatures */
    .sonia{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:50px}
    .sonia-col{text-align:center}
    .sonia-line{border-top:1.5px solid #666;padding-top:5px;font-size:8.5pt;margin-top:50px;color:#444}

    /* footer */
    .footer{text-align:center;font-style:italic;margin-top:22px;padding-top:8px;
      border-top:1px solid #e5e7eb;font-size:9pt;color:#888}

    @page{margin:15mm 14mm}
  `
}

// ── helpers ────────────────────────────────────────────────────────
const v  = (s?: string | null) => s ?? ''
const fd = (label: string, val?: string | null) =>
  `<div class="field"><label>${label}</label><span>${v(val)}</span></div>`

function docHeader(title: string, subtitle: string): string {
  const orig = window.location.origin
  return `
    <div class="doc-header">
      <img src="${orig}/LogoTily.png" alt="Tily"/>
      <div class="dhc">
        <div class="dhc-org">Tily Eto Madagasikara — Skoto Zazalahy</div>
        <div class="dhc-title">${title}</div>
        ${subtitle ? `<div class="dhc-sub">${subtitle}</div>` : ''}
      </div>
      <img src="${orig}/Fleurdelys.png" alt="Fleur de lys"/>
    </div>
  `
}

function openPreview(content: string, title: string, ac: string): void {
  const orig    = window.location.origin
  const pdfName = title.replace(/[^a-zA-Z0-9À-ÿ\s\-]/g, '').trim() + '.pdf'

  const html = `<!DOCTYPE html>
<html lang="mg">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width"/>
  <title>${title}</title>
  <style>${css(ac)}</style>
</head>
<body>
  <div class="toolbar">
    <img src="${orig}/LogoTily.png" style="width:28px;height:28px;object-fit:contain;flex-shrink:0" alt=""/>
    <span class="toolbar-title">${title}</span>
    <button class="tbtn tbtn-dl" id="dl-btn" onclick="telecharger()">&#8595; Télécharger PDF</button>
    <button class="tbtn tbtn-cl" onclick="window.close()">&#10005; Fermer</button>
  </div>
  <div class="page">
    <div class="doc" id="doc-content">${content}</div>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <script>
    function telecharger() {
      var btn = document.getElementById('dl-btn');
      btn.disabled = true;
      btn.textContent = 'Génération…';
      html2pdf().set({
        margin: [12, 10, 12, 10],
        filename: '${pdfName}',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(document.getElementById('doc-content')).save().then(function() {
        btn.disabled = false;
        btn.textContent = '\\u2193 Télécharger PDF';
      });
    }
  </script>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const win  = window.open(URL.createObjectURL(blob), '_blank')
  if (win) win.focus()
}

// ══════════════════════════════════════════════════════════════════
//  FICHE MEMBRE
// ══════════════════════════════════════════════════════════════════
export function printFiche(m: Membre, catLabel: string, catColor: string): void {
  const isMpia = m.sokajy === 'mpiandraikitra'

  // ── section Fanekena ──────────────────────────────────────────
  const fanekenaSection = isMpia ? `
    <h2>Fanekena</h2>
    <div class="row">
      ${fd('Fanekena Tily — Daty', m.fanekena[0]?.daty)}
      ${fd('Fanekena Tily — Tao', m.fanekena[0]?.toerana)}
    </div>
    <div class="row">
      ${fd('Fanekena Mpiandraikitra — Daty', m.fanekena[1]?.daty)}
      ${fd('Fanekena Mpiandraikitra — Tao', m.fanekena[1]?.toerana)}
    </div>
  ` : (() => {
    const fane = m.fanekena?.[0] ?? { daty: '', toerana: '', andraikitra: '' }
    return `
      <h2>Fanekena</h2>
      <div class="row">
        ${fd('Daty', fane.daty)}${fd('Toerana', fane.toerana)}${fd('Andraikitra', fane.andraikitra)}
      </div>
    `
  })()

  // ── section progression (Ambaratonga ou Dingam-piofanana) ─────
  const progressionSection = isMpia ? (() => {
    const fiof     = (m.fiofanana && m.fiofanana.length > 0)
      ? m.fiofanana
      : FIOFANANA_DINGAM.map(d => ({ dingam: d, fotoana: '', toerana: '', tomponAndraikitra: '', fanamarihana: '' }))
    const fiofDone = fiof.filter(fi => fi.fotoana).length
    const fiofPct  = fiof.length > 0 ? Math.round(fiofDone / fiof.length * 100) : 0
    const andRows  = (m.fanekena ?? []).slice(2).map(fn => `
      <tr>
        <td>${v(fn.andraikitra)}</td>
        <td>${v(fn.sokajyFane)}</td>
        <td>${v(fn.toerana)}</td>
        <td>${v(fn.daty)}</td>
      </tr>`).join('')
    const fiofRows = fiof.map(fi => `
      <tr>
        <td style="font-style:italic;white-space:nowrap">${v(fi.dingam)}</td>
        <td>${v(fi.fotoana)}</td>
        <td>${v(fi.toerana)}</td>
        <td>${v(fi.tomponAndraikitra)}</td>
        <td>${v(fi.fanamarihana)}</td>
      </tr>`).join('')
    return `
      <h2>Dingam-piofanana — ${fiofPct}% (${fiofDone}/${fiof.length})</h2>
      <div class="prog">
        <div class="prog-bar"><div class="prog-fill" style="width:${fiofPct}%"></div></div>
        <span class="prog-pct">${fiofPct}%</span>
      </div>
      <table>
        <thead><tr>
          <th>Dingam-piofanana</th><th>Fotoana</th><th>Toerana</th><th>Tompon'andraikitra</th><th>Fanamarihana</th>
        </tr></thead>
        <tbody>${fiofRows}</tbody>
      </table>
      <h2>Andraikitra efa Noraisina teo amin'ny Sehatry ny Fanabeazana Skoto</h2>
      <table>
        <thead><tr><th>Andraikitra</th><th>Sampana</th><th>Tao</th><th>Taona</th></tr></thead>
        <tbody>${andRows}</tbody>
      </table>
      ${m.fahaizana ? `
        <h2>Talenta na Fahaiza-manao Manokana</h2>
        <p style="font-size:10.5pt;white-space:pre-wrap;line-height:1.6;padding:6px 0">${v(m.fahaizana)}</p>
      ` : ''}
    `
  })() : (() => {
    const amb  = m.ambaratonga ?? []
    const done = amb.filter(a => a.daty).length
    const pct  = amb.length > 0 ? Math.round(done / amb.length * 100) : 0
    const rows = amb.map(a => `
      <tr>
        <td style="font-style:italic">${v(a.label)}</td>
        <td>${v(a.daty)}</td>
        <td>${v(a.talenta)}</td>
        <td>${v(a.talenDaty)}</td>
      </tr>`).join('')
    return `
      <h2>Ambaratonga — ${pct}% (${done}/${amb.length})</h2>
      <div class="prog">
        <div class="prog-bar"><div class="prog-fill" style="width:${pct}%"></div></div>
        <span class="prog-pct">${pct}%</span>
      </div>
      <table>
        <thead><tr><th>Ambaratonga</th><th>Daty</th><th>Talenta</th><th>Daty talenta</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `
  })()

  const content = `
    ${docHeader(`FISIN'NY ${m.sokajy.toUpperCase()}`, `${v(m.anarana)} ${v(m.fanampiny)}`)}
    <div class="doc-body">
      <div class="badges">
        <span class="badge">Taom-panabeazana: ${v(m.taomPanabeazana)}</span>
        ${m.numeroCarte ? `<span class="badge">N° ${m.numeroCarte}</span>` : ''}
        <span class="badge">${catLabel}</span>
      </div>
      <div style="overflow:hidden">
        <div class="photo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
          <span style="font-size:8pt;color:#ccc">Sary 4×4</span>
        </div>
        <h2>Momba ny tena</h2>
        <div class="row">${fd('Anarana', m.anarana)}${fd('Fanampiny', m.fanampiny)}</div>
        <div class="row">
          ${fd('Daty nahaterahana', m.datyNahaterahana)}
          ${fd('Toerana', m.toeraNahaterahana)}
          ${fd('Lahy/Vavy', m.sex === 'lahy' ? 'Lahy' : 'Vavy')}
        </div>
      </div>
      <div class="row">${fd("Anaran'ny Ray", m.rayAnarana)}${fd('Asa (Ray)', m.rayAsa)}</div>
      <div class="row">${fd("Anaran'ny Reny", m.renyAnarana)}${fd('Asa (Reny)', m.renyAsa)}</div>
      <div class="row">${fd('Finday (RAD)', m.finday)}${fd('Adiresy mazava', m.adiresy)}</div>
      ${isMpia ? `
        <div class="row">
          ${fd('Fiantso', m.fiantso)}${fd('Andraikitra', m.andraikitrePoste)}
        </div>
        <div class="row">
          ${fd('Asa atao', m.asaAtao)}${fd('Traikefa ananana', m.traikefa)}
        </div>
      ` : `
        <div class="row">
          ${fd('Kilasy', m.kilasy)}
          ${fd('Sekoly Alahady', m.sekolyAlahady ? 'Eny' : 'Tsia')}
          ${fd('Sampana ao am-piangonana', m.sampanaPiangonana)}
        </div>
        <div class="row">
          ${fd('Lovitao nidirana', m.lidiRaLovitao)}
          ${m.sokajy !== 'lovitao' ? fd('Tily Maitso', m.tilyMaitso) : ''}
        </div>
      `}
      ${m.aretina ? `<div class="row">${fd('Aretina / Fanafodiny', m.aretina)}</div>` : ''}
      ${m.sakafo  ? `<div class="row">${fd('Sakafo tsy zaka', m.sakafo)}</div>` : ''}
      ${m.tenyRaaman ? `<div class="row">${fd("Teny avy amin'ny Ray aman-dReny", m.tenyRaaman)}</div>` : ''}

      ${fanekenaSection}
      ${progressionSection}

      <p class="footer">Mankasitraka tompoko, koa dia manonona ny fiadanan'ny Tompo ho aminareo.</p>
    </div>
  `
  openPreview(content, `FISIN'NY ${m.sokajy.toUpperCase()} — ${v(m.anarana)} ${v(m.fanampiny)}`, catColor)
}

// ══════════════════════════════════════════════════════════════════
//  FANDAHARAM-PANABEAZANA
// ══════════════════════════════════════════════════════════════════
export function printFDP(fdp: FDP): void {
  const ac = CATS[fdp.sokajy]?.color ?? BRAND

  const rows = (fdp.rows ?? []).map(r => `
    <tr>
      <td>${v(r.daty)}</td><td>${v(r.lohahevitra)}</td>
      <td>${v(r.sehatra)}</td><td>${v(r.fomba)}</td><td>${v(r.toerana)}</td>
    </tr>`).join('')

  const kendrena = (fdp.kendrena ?? []).filter(Boolean)
    .map(k => `<li style="margin-left:18px;margin-bottom:3px">${k}</li>`).join('')

  const content = `
    ${docHeader('FANDAHARAM-PANABEAZANA', `${v(fdp.quarter)} — Taom-panabeazana ${v(fdp.taomPanabeazana)}`)}
    <div class="doc-body">
      <div class="badges">
        <span class="badge">Taom-panabeazana: ${v(fdp.taomPanabeazana)}</span>
        <span class="badge">${fdp.months} volana</span>
        ${fdp.sampana ? `<span class="badge">${fdp.sampana}</span>` : ''}
      </div>
      <div class="info-strip">
        <span><b>Faritany:</b> ${v(fdp.faritany)}</span>
        <span><b>Fivondronana:</b> ${v(fdp.fivondronana)}</span>
        <span><b>Faritra:</b> ${v(fdp.faritra)}</span>
        <span><b>Sampana:</b> ${v(fdp.sampana)}</span>
      </div>
      ${fdp.tanjona ? `<p style="margin-bottom:6px"><b>TANJONA:</b> ${fdp.tanjona}</p>` : ''}
      ${kendrena ? `<p style="font-weight:700;margin-bottom:4px">Zava-kendrena:</p><ul style="margin-bottom:10px">${kendrena}</ul>` : ''}
      <table>
        <thead><tr><th>Daty</th><th>Lohahevitra</th><th>Sehatra</th><th>Fomba</th><th>Toerana</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="sonia">
        ${['Ny Mpiandraikitra','Ny Tonia','Ny Komitim-pivondronana','Ny Filoha']
          .map(s => `<div class="sonia-col"><div class="sonia-line">${s}</div></div>`).join('')}
      </div>
    </div>
  `
  openPreview(content, `Fandaharam-panabeazana ${fdp.taomPanabeazana}`, ac)
}

// ══════════════════════════════════════════════════════════════════
//  FISY TEKNIKA
// ══════════════════════════════════════════════════════════════════
export function printTeknika(tek: Teknika): void {
  const ac = CATS[tek.sokajy]?.color ?? BRAND

  const rows = (tek.rows ?? []).map(r => `
    <tr>
      <td>${v(r.ora)}</td><td>${v(r.atao)}</td><td>${v(r.fomba)}</td>
      <td>${v(r.tomponAndraikitra)}</td><td>${v(r.fitaovana)}</td><td>${v(r.fanamarihana)}</td>
    </tr>`).join('')

  const kendrena = (tek.kendrena ?? []).filter(Boolean)
    .map(k => `<li style="margin-left:18px;margin-bottom:3px">${k}</li>`).join('')

  const content = `
    ${docHeader('FISY TEKNIKA', `${v(tek.daty)} — ${v(tek.toerana)}`)}
    <div class="doc-body">
      <div class="badges">
        <span class="badge">Taom-panabeazana: ${v(tek.taomPanabeazana)}</span>
        ${tek.sampana ? `<span class="badge">${tek.sampana}</span>` : ''}
      </div>
      <div class="row">
        ${fd('Daty', tek.daty)}${fd('Tanjona', tek.tanjona)}
        ${fd('Faharetany', tek.faharetany)}${fd('Toerana', tek.toerana)}
      </div>
      ${tek.vontoatiny ? `<div class="row">${fd('Vontoatiny', tek.vontoatiny)}</div>` : ''}
      ${kendrena ? `<p style="font-weight:700;margin-bottom:4px">Zava-kendrena:</p><ul style="margin-bottom:10px">${kendrena}</ul>` : ''}
      <table>
        <thead>
          <tr><th>Ora</th><th>Atao</th><th>Fomba</th><th>Tompon'andraikitra</th><th>Fitaovana</th><th>Fanamarihana</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      ${tek.tombane ? `<p style="margin-top:14px"><b>Tomban'ezaka:</b> ${tek.tombane}</p>` : ''}
    </div>
  `
  openPreview(content, `Fisy Teknika ${tek.taomPanabeazana}`, ac)
}

// ══════════════════════════════════════════════════════════════════
//  FAFI LIST
// ══════════════════════════════════════════════════════════════════
export function printFafiList(list: FafiEntry[], taom: string, catLabel?: string): void {
  const ac = '#1C6E3D'
  const statusLabel: Record<string, string> = {
    nandoa: 'NANDOA', ampahany: 'AMPAHANY', tsy_nandoa: 'TSY NANDOA',
  }
  const statusColor: Record<string, string> = {
    nandoa: '#1a5c0a', ampahany: '#7a4f00', tsy_nandoa: '#7a0000',
  }
  const statusBg: Record<string, string> = {
    nandoa: '#e8f5e2', ampahany: '#fef3dc', tsy_nandoa: '#fdeaea',
  }

  const rows = list.map(f => `
    <tr>
      <td style="font-family:monospace;font-size:9pt">${v(f.numeroCarte)}</td>
      <td><b>${v(f.anarana)} ${v(f.fanampiny)}</b></td>
      <td>${v(f.sokajy)}</td>
      <td>${v(f.datyFandoavana)}</td>
      <td style="text-align:right">${f.volaNaloa ? Number(f.volaNaloa).toLocaleString('fr-MG') + ' Ar' : '—'}</td>
      <td style="color:${statusColor[f.statut] ?? '#000'};background:${statusBg[f.statut] ?? 'transparent'};font-weight:700;font-size:8.5pt;text-align:center">
        ${statusLabel[f.statut] ?? f.statut}
      </td>
      <td>${v(f.mpandray)}</td>
    </tr>`).join('')

  const totalVola = list
    .filter(f => f.statut === 'nandoa')
    .reduce((s, f) => s + (parseFloat(f.volaNaloa) || 0), 0)

  const nandoa    = list.filter(f => f.statut === 'nandoa').length
  const ampahany  = list.filter(f => f.statut === 'ampahany').length
  const tsyNandoa = list.filter(f => f.statut === 'tsy_nandoa').length

  const content = `
    ${docHeader('FAFI — Lisitry ny Fandoavana', `Taom-panabeazana ${taom}${catLabel ? ' — ' + catLabel : ''}`)}
    <div class="doc-body">
      <div class="badges">
        <span class="badge">Taom-panabeazana: ${taom}</span>
        ${catLabel ? `<span class="badge">${catLabel}</span>` : ''}
        <span class="badge">${list.length} mpikambana</span>
      </div>
      <div class="info-strip" style="justify-content:center;gap:24px">
        <span style="color:#1a5c0a;font-weight:700">&#10003; Nandoa: ${nandoa}</span>
        <span style="color:#7a4f00;font-weight:700">&#9654; Ampahany: ${ampahany}</span>
        <span style="color:#7a0000;font-weight:700">&#10005; Tsy nandoa: ${tsyNandoa}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>N° Kara</th><th>Anarana</th><th>Sokajy</th><th>Daty fandoavana</th>
            <th>Vola naloa</th><th>Statut</th><th>Mpandray</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr>
            <td colspan="4" style="text-align:right;font-weight:700">TOTAL vola angonina:</td>
            <td style="text-align:right;font-weight:700;color:#1a5c0a">${totalVola.toLocaleString('fr-MG')} Ar</td>
            <td colspan="2"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  `
  openPreview(content, `FAFI ${taom}`, ac)
}
