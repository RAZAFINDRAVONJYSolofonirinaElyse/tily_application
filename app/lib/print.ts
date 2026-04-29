// src/lib/print.ts — browser print / PDF export

import type { Membre, FDP, Teknika, FafiEntry, SokajyType } from '@/types'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Lato',Arial,sans-serif;font-size:11pt;color:#000;background:#fff}
  h1{font-size:15pt;text-align:center;font-weight:700;text-transform:uppercase;margin-bottom:14px}
  h2{font-size:11pt;font-weight:700;text-transform:uppercase;border-bottom:1px solid #000;
     padding-bottom:2px;margin:14px 0 8px}
  .badge{display:inline-block;padding:2px 10px;border:1px solid #000;border-radius:12px;
         font-size:9pt;font-weight:700;margin:0 4px 8px}
  .row{display:flex;gap:20px;margin-bottom:7px;flex-wrap:wrap}
  .field{flex:1;min-width:120px}
  .field label{font-size:8.5pt;color:#555;display:block}
  .field span{font-size:10pt;border-bottom:1px dotted #555;display:block;min-height:18px}
  .photo{width:90px;height:110px;border:1px solid #000;float:right;margin-left:16px;
         display:flex;align-items:center;justify-content:center;font-size:8pt;color:#888;
         text-align:center;flex-direction:column}
  table{width:100%;border-collapse:collapse;margin-top:8px;font-size:10pt}
  th,td{border:1px solid #000;padding:5px 7px}
  th{font-weight:700;background:#f0f0f0;font-size:9.5pt}
  tfoot td,tfoot th{font-weight:700;background:#f5f5f5}
  .prog{display:flex;align-items:center;gap:6px}
  .prog-bar{flex:1;height:6px;border:1px solid #000}
  .prog-fill{height:100%;background:#222}
  .sonia{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:50px}
  .sonia-col{text-align:center}
  .sonia-line{border-top:1px solid #000;padding-top:4px;font-size:8.5pt;margin-top:48px}
  .footer{text-align:center;font-style:italic;margin-top:28px;padding-top:8px;
          border-top:1px solid #ccc;font-size:9.5pt}
  @page{margin:17mm 15mm}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
`

function openPrint(html: string, title: string): void {
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(
    `<!DOCTYPE html><html lang="mg"><head><meta charset="utf-8"/>
    <title>${title}</title><style>${CSS}</style></head><body>${html}</body></html>`
  )
  win.document.close()
  win.focus()
  setTimeout(() => { win.print(); win.close() }, 700)
}

const v  = (s?: string | null) => s ?? ''
const fd = (label: string, val?: string | null) =>
  `<div class="field"><label>${label}</label><span>${v(val)}</span></div>`

// ============================================================
//  FICHE MEMBRE
// ============================================================
export function printFiche(m: Membre, catLabel: string, catColor: string): void {
  const amb  = m.ambaratonga ?? []
  const done = amb.filter(a => a.daty).length
  const pct  = amb.length > 0 ? Math.round(done / amb.length * 100) : 0
  const fane = m.fanekena?.[0] ?? { daty: '', toerana: '', andraikitra: '' }

  const ambRows = amb.map(a => `
    <tr>
      <td style="font-style:italic">${v(a.label)}</td>
      <td>${v(a.daty)}</td>
      <td>${v(a.talenta)}</td>
      <td>${v(a.talenDaty)}</td>
    </tr>`).join('')

  openPrint(`
    <div style="overflow:hidden">
      <div class="photo">Sary<br/>4×4</div>
      <h1 style="color:${catColor}">FISIN'NY ${m.sokajy.toUpperCase()}</h1>
      <div style="text-align:center;margin-bottom:12px">
        <span class="badge">Taom-panabeazana: ${v(m.taomPanabeazana)}</span>
        ${m.numeroCarte ? `<span class="badge">N° ${m.numeroCarte}</span>` : ''}
        <span class="badge">${catLabel}</span>
      </div>
    </div>
    <h2>Momba ny tena</h2>
    <div class="row">${fd('Anarana', m.anarana)}${fd('Fanampiny', m.fanampiny)}</div>
    <div class="row">
      ${fd('Daty nahaterahana', m.datyNahaterahana)}
      ${fd('Toerana', m.toeraNahaterahana)}
      ${fd('Lahy/Vavy', m.sex === 'lahy' ? 'Lahy' : 'Vavy')}
    </div>
    <div class="row">${fd("Anaran'ny Ray", m.rayAnarana)}${fd('Asa (Ray)', m.rayAsa)}</div>
    <div class="row">${fd("Anaran'ny Reny", m.renyAnarana)}${fd('Asa (Reny)', m.renyAsa)}</div>
    <div class="row">${fd('Finday (RAD)', m.finday)}${fd('Adiresy mazava', m.adiresy)}</div>
    <div class="row">
      ${fd('Kilasy', m.kilasy)}
      ${fd('Sekoly Alahady', m.sekolyAlahady ? 'Eny' : 'Tsia')}
      ${fd('Sampana ao am-piangonana', m.sampanaPiangonana)}
    </div>
    <div class="row">
      ${fd('Lovitao nidirana', m.lidiRaLovitao)}
      ${m.sokajy !== 'lovitao' ? fd('Tily Maitso', m.tilyMaitso) : ''}
    </div>
    ${m.aretina ? `<div class="row">${fd('Aretina / Fanafodiny', m.aretina)}</div>` : ''}
    ${m.sakafo  ? `<div class="row">${fd('Sakafo tsy zaka', m.sakafo)}</div>` : ''}
    ${m.tenyRaaman ? `<div class="row">${fd("Teny avy amin'ny Ray aman-dReny", m.tenyRaaman)}</div>` : ''}

    <h2>Fanekena</h2>
    <div class="row">
      ${fd('Daty', fane.daty)}${fd('Toerana', fane.toerana)}${fd('Andraikitra', fane.andraikitra)}
    </div>

    <h2>Ambaratonga — ${pct}% (${done}/${amb.length})</h2>
    <div class="prog" style="margin-bottom:10px">
      <div class="prog-bar"><div class="prog-fill" style="width:${pct}%"></div></div>
      <span style="font-size:10pt;font-weight:700">${pct}%</span>
    </div>
    <table>
      <thead><tr><th>Ambaratonga</th><th>Daty</th><th>Talenta</th><th>Daty talenta</th></tr></thead>
      <tbody>${ambRows}</tbody>
    </table>
    <p class="footer">Mankasitraka tompoko, koa dia manonona ny fiadanan'ny Tompo ho aminareo.</p>
  `, `FISIN'NY ${m.sokajy.toUpperCase()} — ${m.anarana} ${m.fanampiny}`)
}

// ============================================================
//  FANDAHARAM-PANABEAZANA
// ============================================================
export function printFDP(fdp: FDP): void {
  const rows = (fdp.rows ?? []).map(r => `
    <tr>
      <td>${v(r.daty)}</td><td>${v(r.lohahevitra)}</td>
      <td>${v(r.sehatra)}</td><td>${v(r.fomba)}</td><td>${v(r.toerana)}</td>
    </tr>`).join('')

  const kendrena = (fdp.kendrena ?? []).filter(Boolean)
    .map(k => `<li style="margin-left:18px">${k}</li>`).join('')

  openPrint(`
    <div style="display:flex;justify-content:space-between;font-size:9.5pt;margin-bottom:8px;flex-wrap:wrap;gap:4px">
      <span><b>Faritany:</b> ${v(fdp.faritany)}</span>
      <span><b>Fivondronana:</b> ${v(fdp.fivondronana)}</span>
      <span><b>Faritra:</b> ${v(fdp.faritra)}</span>
      <span><b>Sampana:</b> ${v(fdp.sampana)}</span>
    </div>
    <h1>FANDAHARAM-PANABEAZANA ${v(fdp.quarter)}</h1>
    <div style="text-align:center;margin-bottom:12px">
      <span class="badge">Taom-panabeazana: ${v(fdp.taomPanabeazana)}</span>
      <span class="badge">${fdp.months} volana</span>
    </div>
    ${fdp.tanjona ? `<p style="margin-bottom:6px"><b>TANJONA:</b> ${fdp.tanjona}</p>` : ''}
    ${kendrena ? `<p><b>Zava-kendrena:</b></p><ul style="margin-bottom:10px">${kendrena}</ul>` : ''}
    <table>
      <thead><tr><th>Daty</th><th>Lohahevitra</th><th>Sehatra</th><th>Fomba</th><th>Toerana</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="sonia">
      ${['Ny Mpiandraikitra','Ny Tonia','Ny Komitim-pivondronana','Ny Filoha']
        .map(s => `<div class="sonia-col"><div class="sonia-line">${s}</div></div>`).join('')}
    </div>
  `, `Fandaharam-panabeazana ${fdp.taomPanabeazana}`)
}

// ============================================================
//  FISY TEKNIKA
// ============================================================
export function printTeknika(tek: Teknika): void {
  const rows = (tek.rows ?? []).map(r => `
    <tr>
      <td>${v(r.ora)}</td><td>${v(r.atao)}</td><td>${v(r.fomba)}</td>
      <td>${v(r.tomponAndraikitra)}</td><td>${v(r.fitaovana)}</td><td>${v(r.fanamarihana)}</td>
    </tr>`).join('')

  const kendrena = (tek.kendrena ?? []).filter(Boolean)
    .map(k => `<li style="margin-left:18px">${k}</li>`).join('')

  openPrint(`
    <h1>FISY TEKNIKA</h1>
    <div style="text-align:center;margin-bottom:12px">
      <span class="badge">Taom-panabeazana: ${v(tek.taomPanabeazana)}</span>
      ${tek.sampana ? `<span class="badge">${tek.sampana}</span>` : ''}
    </div>
    <div class="row">
      ${fd('Daty', tek.daty)}${fd('Tanjona', tek.tanjona)}
      ${fd('Faharetany', tek.faharetany)}${fd('Toerana', tek.toerana)}
    </div>
    ${tek.vontoatiny ? `<div class="row">${fd('Vontoatiny', tek.vontoatiny)}</div>` : ''}
    ${kendrena ? `<p><b>Zava-kendrena:</b></p><ul style="margin-bottom:10px">${kendrena}</ul>` : ''}
    <table>
      <thead>
        <tr><th>Ora</th><th>Atao</th><th>Fomba</th><th>Tompon'andraikitra</th><th>Fitaovana</th><th>Fanamarihana</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    ${tek.tombane ? `<p style="margin-top:14px"><b>Tomban'ezaka:</b> ${tek.tombane}</p>` : ''}
  `, `Fisy Teknika ${tek.taomPanabeazana}`)
}

// ============================================================
//  FAFI LIST
// ============================================================
export function printFafiList(list: FafiEntry[], taom: string, catLabel?: string): void {
  const statusLabel: Record<string, string> = {
    nandoa: 'NANDOA', ampahany: 'AMPAHANY', tsy_nandoa: 'TSY NANDOA',
  }
  const statusColor: Record<string, string> = {
    nandoa: '#1a5c0a', ampahany: '#7a4f00', tsy_nandoa: '#7a0000',
  }

  const rows = list.map(f => `
    <tr>
      <td style="font-family:monospace">${v(f.numeroCarte)}</td>
      <td><b>${v(f.anarana)} ${v(f.fanampiny)}</b></td>
      <td>${v(f.sokajy)}</td>
      <td>${v(f.datyFandoavana)}</td>
      <td style="text-align:right">
        ${f.volaNaloa ? Number(f.volaNaloa).toLocaleString('fr-MG') + ' Ar' : ''}
      </td>
      <td style="color:${statusColor[f.statut] ?? '#000'};font-weight:700">
        ${statusLabel[f.statut] ?? f.statut}
      </td>
      <td>${v(f.mpandray)}</td>
    </tr>`).join('')

  const totalVola = list
    .filter(f => f.statut === 'nandoa')
    .reduce((s, f) => s + (parseFloat(f.volaNaloa) || 0), 0)

  openPrint(`
    <h1>FAFI — Lisitry ny Fandoavana</h1>
    <div style="text-align:center;margin-bottom:12px">
      <span class="badge">Taom-panabeazana: ${taom}</span>
      ${catLabel ? `<span class="badge">${catLabel}</span>` : ''}
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
          <td colspan="4" style="text-align:right">TOTAL vola angonina:</td>
          <td style="text-align:right">${totalVola.toLocaleString('fr-MG')} Ar</td>
          <td colspan="2"></td>
        </tr>
      </tfoot>
    </table>
  `, `FAFI ${taom}`)
}
