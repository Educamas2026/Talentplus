// ============================================================
// Google Apps Script — Webhook Educamás
// ============================================================
// INSTRUCCIONES:
// 1. Abre tu Google Sheet → Extensiones → Apps Script
// 2. Borra todo y pega este código
// 3. Implementar → Nueva implementación → Aplicación web
//    - Ejecutar como: Yo
//    - Acceso: Cualquier persona
// 4. Copia la URL y pégala en la app en Configuración
// ============================================================

const HOJA_EMPRESAS  = "Empresas";
const HOJA_EGRESADOS = "Egresados";

const COLS_EMPRESAS = ["Fecha","Nombre","Categoría sector","Sector","Tamaño","Ciudad","Áreas","Vacantes","Skills técnicas","Habilidades blandas","Experiencia","Modalidad","Contrato","Salario","Formación","Inglés","PcD","Cert. Disc","Tipo Disc","Contexto","Perfil IA"];
const COLS_EGRESADOS = ["Fecha","Nombre","Carrera","Habilidades","Experiencia","Ciudad","Modalidad"];

function doGet(e) {
  const action = e.parameter.action || "";

  if (action === "ping") {
    return resp({ status: "ok", msg: "Conexión exitosa" });
  }

  if (action === "guardarEmpresa") {
    try {
      const d = JSON.parse(e.parameter.data || "{}");
      escribirFila(HOJA_EMPRESAS, COLS_EMPRESAS, [
        d.fecha, d.nombre, d.sectorCategoria, d.sector, d.tamanio, d.ciudad,
        d.areas, d.vacantes, d.skills, d.blandas, d.exp, d.modalidad,
        d.contrato, d.salario, d.formacion, d.ingles,
        d.pcd, d.cert, d.tipoDisc, d.contexto, d.perfil_ia,
      ]);
      return resp({ status: "ok" });
    } catch(err) { return resp({ status: "error", msg: err.toString() }); }
  }

  if (action === "guardarEgresado") {
    try {
      const d = JSON.parse(e.parameter.data || "{}");
      escribirFila(HOJA_EGRESADOS, COLS_EGRESADOS, [
        d.fecha, d.nombre, d.carrera, d.skills, d.exp, d.ciudad, d.modalidad,
      ]);
      return resp({ status: "ok" });
    } catch(err) { return resp({ status: "error", msg: err.toString() }); }
  }

  if (action === "leerEgresados") {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(HOJA_EGRESADOS);
      if (!sheet || sheet.getLastRow() < 2) return resp([]);
      const data = sheet.getRange(2, 1, sheet.getLastRow()-1, 7).getValues();
      const result = data.map(r => ({
        fecha: r[0], nombre: r[1], carrera: r[2],
        skills: r[3], exp: r[4], ciudad: r[5], modalidad: r[6],
      }));
      return resp(result);
    } catch(err) { return resp({ status: "error", msg: err.toString() }); }
  }

  return resp({ status: "error", msg: "Acción no reconocida: " + action });
}

function escribirFila(nombreHoja, columnas, valores) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(nombreHoja);
  if (!sheet) {
    sheet = ss.insertSheet(nombreHoja);
    sheet.appendRow(columnas);
    sheet.getRange(1,1,1,columnas.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(columnas);
    sheet.getRange(1,1,1,columnas.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  sheet.appendRow(valores);
  sheet.autoResizeColumns(1, columnas.length);
}

function resp(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
