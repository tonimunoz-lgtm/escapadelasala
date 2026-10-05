// =============================================================
//  CREACIÓ D'EMPRESA A CATALUNYA — dades didàctiques
//  Imports orientatius (2026). Els temps "reals" són informatius;
//  al joc cada tràmit dura uns segons (segonsJoc).
//  Revisa-ho amb el professorat: la normativa i les taxes canvien.
// =============================================================

export const ESTALVIS_INICIALS = 25000; // diners personals de l'alumne/a per començar

// Temps del joc: 1 hora real = 1 setmana a l'empresa.
// Els costos mensuals es cobren proporcionalment (mes = 4,33 setmanes).
export const SETMANES_PER_MES = 52 / 12;

export const FORMES = {
  autonom: {
    nom: 'Empresari/ària individual (autònom/a)', curt: 'Autònom', sufix: '', lletraNif: null,
    socisMin: 1, socisMax: 1, capitalMin: 0, desemborsMin: 1,
    responsabilitat: 'Il·limitada: respons dels deutes amb tot el teu patrimoni personal (pis, cotxe, estalvis).',
    tributacio: 'IRPF (de l\'11% al 47% segons beneficis).',
    avantatges: 'És la manera més ràpida i barata de començar. No cal capital ni notari.',
    inconvenients: 'Si les coses van malament, et poden embargar els béns personals. Amb molts beneficis, l\'IRPF surt car.',
    quotaMensual: 80, quotaText: 'Quota d\'autònom (RETA) amb tarifa plana de 80 €/mes els primers 12 mesos.',
    bancFactor: 0.8, limitada: false,
    tramits: ['hisenda036', 'reta', 'comunicacio'],
  },
  cb: {
    nom: 'Comunitat de béns (CB)', curt: 'CB', sufix: 'CB', lletraNif: 'E',
    socisMin: 2, socisMax: 10, capitalMin: 0, desemborsMin: 1,
    responsabilitat: 'Il·limitada i solidària: cada comuner pot haver de pagar tots els deutes.',
    tributacio: 'IRPF de cada comuner (atribució de rendes).',
    avantatges: 'Senzilla i barata per a 2 o més persones que comparteixen béns.',
    inconvenients: 'Mateix risc que l\'autònom, multiplicat per tots els socis.',
    quotaMensual: 80, quotaText: 'Cada comuner es dona d\'alta d\'autònom (80 €/mes amb tarifa plana).',
    bancFactor: 0.8, limitada: false,
    tramits: ['contracte', 'itp', 'nif036', 'reta', 'comunicacio'],
  },
  scp: {
    nom: 'Societat civil privada (SCP)', curt: 'SCP', sufix: 'SCP', lletraNif: 'J',
    socisMin: 2, socisMax: 10, capitalMin: 0, desemborsMin: 1,
    responsabilitat: 'Il·limitada: els socis responen amb el seu patrimoni.',
    tributacio: 'Si té activitat mercantil, Impost de Societats (25%).',
    avantatges: 'Contracte privat, sense capital mínim.',
    inconvenients: 'Responsabilitat il·limitada i poca credibilitat davant dels bancs.',
    quotaMensual: 80, quotaText: 'Els socis que hi treballen paguen la quota d\'autònom.',
    bancFactor: 0.8, limitada: false,
    tramits: ['contracte', 'itp', 'nif036', 'reta', 'comunicacio'],
  },
  sl: {
    nom: 'Societat limitada (SL)', curt: 'SL', sufix: 'SL', lletraNif: 'B',
    socisMin: 1, socisMax: 50, capitalMin: 1, desemborsMin: 1,
    responsabilitat: 'Limitada al capital aportat. Si el capital és inferior a 3.000 €, fins a 3.000 € en cas de liquidació.',
    tributacio: 'Impost de Societats (23-25%; 15% els dos primers anys amb beneficis, si és empresa nova).',
    avantatges: 'La forma més habitual. Protegeix el teu patrimoni personal. Des de la Llei Crea i Creix (2022) es pot crear amb 1 €.',
    inconvenients: 'Cal notari i Registre Mercantil, i portar comptabilitat formal. Si el capital és menor de 3.000 €, el 20% dels beneficis va a reserva legal.',
    quotaMensual: 300, quotaText: 'L\'administrador/a que hi treballa és autònom/a societari/ària (uns 300 €/mes).',
    bancFactor: 1, limitada: true,
    tramits: ['certificacio', 'banc', 'estatuts', 'notari', 'nif', 'itpExempt', 'registre', 'censal', 'reta', 'comunicacio'],
  },
  sll: {
    nom: 'Societat limitada laboral (SLL)', curt: 'SLL', sufix: 'SLL', lletraNif: 'B',
    socisMin: 2, socisMax: 50, capitalMin: 1, desemborsMin: 1,
    responsabilitat: 'Limitada al capital aportat.',
    tributacio: 'Impost de Societats, amb avantatges fiscals si dota el fons especial de reserva.',
    avantatges: 'La majoria del capital és dels socis treballadors: autoocupació col·lectiva amb ajuts.',
    inconvenients: 'Cap soci pot tenir més d\'un terç del capital (amb excepcions) i cal la qualificació de laboral.',
    quotaMensual: 300, quotaText: 'Els socis treballadors cotitzen a la Seguretat Social.',
    bancFactor: 1, limitada: true,
    tramits: ['certificacio', 'banc', 'estatuts', 'notari', 'nif', 'qualificacio', 'registre', 'censal', 'reta', 'comunicacio'],
  },
  sa: {
    nom: 'Societat anònima (SA)', curt: 'SA', sufix: 'SA', lletraNif: 'A',
    socisMin: 1, socisMax: 999, capitalMin: 60000, desemborsMin: 0.25,
    responsabilitat: 'Limitada al capital aportat.',
    tributacio: 'Impost de Societats (25%).',
    avantatges: 'Pensada per a empreses grans: accions fàcils de vendre, més confiança dels bancs.',
    inconvenients: 'Capital mínim de 60.000 € (com a mínim el 25% desemborsat a l\'inici) i tràmits més cars.',
    quotaMensual: 300, quotaText: 'Els consellers que hi treballen cotitzen com a autònoms (uns 300 €/mes).',
    bancFactor: 1.3, limitada: true,
    tramits: ['certificacio', 'banc', 'estatuts', 'notari', 'nif', 'itpExempt', 'registre', 'censal', 'reta', 'comunicacio'],
  },
  coop: {
    nom: 'Cooperativa (SCCL)', curt: 'Cooperativa', sufix: 'SCCL', lletraNif: 'F',
    socisMin: 2, socisMax: 50, capitalMin: 3000, desemborsMin: 1,
    responsabilitat: 'Limitada a les aportacions al capital social.',
    tributacio: 'Impost de Societats amb règim fiscal especial de cooperatives (20%; 25% resultats extracooperatius).',
    avantatges: 'Empresa democràtica: una persona, un vot. Hi ha ajuts per a l\'economia social.',
    inconvenients: 'Capital mínim de 3.000 € totalment desemborsat. Amb 2 socis, cal incorporar-ne un tercer en 5 anys.',
    quotaMensual: 300, quotaText: 'Els socis treballadors poden triar entre autònoms o règim general.',
    bancFactor: 1, limitada: true,
    tramits: ['certificacioCoop', 'assemblea', 'banc', 'estatuts', 'notari', 'nif', 'registreCoop', 'censal', 'reta', 'comunicacio'],
  },
};

// Cada tràmit: on es fa, què és, cost (€) i temps real orientatiu.
// cost pot ser una funció (forma, capital) => import
export const TRAMITS = {
  certificacio: {
    nom: 'Certificació negativa de denominació',
    on: 'Registre Mercantil Central (en línia)',
    que: 'Demanes el nom de la societat. El Registre comprova que cap altra empresa no el té i te\'l reserva. Hi pots proposar fins a 5 noms per ordre de preferència.',
    cost: 17, real: '1-3 dies hàbils', segonsJoc: 8, nom_: true,
  },
  certificacioCoop: {
    nom: 'Certificació negativa de denominació',
    on: 'Registre de Cooperatives de Catalunya',
    que: 'Les cooperatives no van al Registre Mercantil: demanen el nom al registre de cooperatives.',
    cost: 0, real: 'uns dies', segonsJoc: 8, nom_: true,
  },
  assemblea: {
    nom: 'Assemblea constituent',
    on: 'Entre els socis fundadors',
    que: 'Els socis aproven els estatuts, nomenen el consell rector i acorden les aportacions al capital.',
    cost: 0, real: '1 dia', segonsJoc: 5,
  },
  banc: {
    nom: 'Compte bancari i dipòsit del capital',
    on: 'Una entitat bancària',
    que: 'Obres un compte a nom de la societat "en constitució" i hi ingresseu les aportacions. El banc et dona el certificat de dipòsit que demanarà el notari.',
    cost: 0, real: '1 dia', segonsJoc: 6,
  },
  estatuts: {
    nom: 'Estatuts de la societat',
    on: 'Advocat/gestoria o model oficial',
    que: 'Són les normes de l\'empresa: nom, objecte social, domicili, capital, com s\'administra. Pots fer servir els estatuts tipus oficials (gratis, més ràpid) o encarregar-ne uns a mida.',
    cost: 0, real: '1-7 dies', segonsJoc: 6, opcions: true,
  },
  notari: {
    nom: 'Escriptura pública davant notari',
    on: 'Notaria',
    que: 'Els socis signen l\'escriptura de constitució amb els estatuts i el certificat del banc. Des d\'aquest moment la societat existeix, però encara no està inscrita.',
    cost: (f, cap, tipus) => (tipus && f === 'sl' && cap <= 3100 ? 60 : f === 'sa' ? 600 : 300),
    real: '1 dia (amb cita)', segonsJoc: 10,
  },
  nif: {
    nom: 'NIF provisional',
    on: 'Agència Tributària (normalment el demana el mateix notari)',
    que: 'Número d\'identificació fiscal de l\'empresa. Amb el NIF provisional ja pots operar mentre s\'inscriu al registre.',
    cost: 0, real: 'el mateix dia', segonsJoc: 4,
  },
  itpExempt: {
    nom: 'Impost de transmissions (model 600)',
    on: 'Agència Tributària de Catalunya',
    que: 'La constitució de societats està exempta de l\'impost d\'operacions societàries, però cal presentar-ne la declaració.',
    cost: 0, real: 'en 30 dies', segonsJoc: 4,
  },
  itp: {
    nom: 'Impost sobre aportacions (ITP-AJD)',
    on: 'Agència Tributària de Catalunya',
    que: 'Quan els socis aporten béns a una comunitat de béns o societat civil, cal declarar-ho.',
    cost: (f, cap) => Math.round(cap * 0.01), real: 'en 30 dies', segonsJoc: 4,
  },
  contracte: {
    nom: 'Contracte privat entre socis',
    on: 'Entre els socis (millor amb assessorament)',
    que: 'Document on poseu per escrit què aporta cadascú, com repartiu beneficis i qui gestiona. Si s\'aporten immobles, cal escriptura pública.',
    cost: 0, real: '1 dia', segonsJoc: 5,
  },
  registre: {
    nom: 'Inscripció al Registre Mercantil',
    on: 'Registre Mercantil provincial',
    que: 'La societat adquireix personalitat jurídica plena. Es publica al BORME.',
    cost: (f, cap, tipus) => (tipus && f === 'sl' && cap <= 3100 ? 40 : f === 'sa' ? 300 : 150),
    real: '1-15 dies', segonsJoc: 10,
  },
  registreCoop: {
    nom: 'Inscripció al Registre de Cooperatives',
    on: 'Registre de Cooperatives de Catalunya',
    que: 'La cooperativa adquireix personalitat jurídica. Amb 10 socis o menys es pot fer pel procediment exprés.',
    cost: 0, real: '1-30 dies', segonsJoc: 10,
  },
  qualificacio: {
    nom: 'Qualificació com a societat laboral',
    on: 'Registre de Societats Laborals (Generalitat)',
    que: 'Una administració comprova que la majoria del capital és dels socis treballadors i inscriu la societat com a laboral.',
    cost: 0, real: '1-2 setmanes', segonsJoc: 8,
  },
  nif036: {
    nom: 'NIF de l\'entitat (model 036)',
    on: 'Agència Tributària',
    que: 'La comunitat de béns o la societat civil necessita el seu propi NIF.',
    cost: 0, real: '1 dia', segonsJoc: 4,
  },
  hisenda036: {
    nom: 'Alta censal a Hisenda (model 036) i IAE',
    on: 'Agència Tributària (en línia)',
    que: 'Comuniques l\'inici de l\'activitat i tries l\'epígraf de l\'IAE. Els autònoms estan exempts de pagar l\'IAE, però s\'hi han de donar d\'alta.',
    cost: 0, real: 'el mateix dia', segonsJoc: 4,
  },
  censal: {
    nom: 'Declaració censal i NIF definitiu (model 036)',
    on: 'Agència Tributària',
    que: 'Amb l\'escriptura inscrita, demanes el NIF definitiu i comuniques les obligacions fiscals (IVA, Impost de Societats, IAE).',
    cost: 0, real: '1 dia', segonsJoc: 4,
  },
  reta: {
    nom: 'Alta al RETA (Seguretat Social)',
    on: 'Tresoreria General de la Seguretat Social (Import@ss)',
    que: 'Qui treballa a la seva empresa com a autònom/a s\'hi ha de donar d\'alta abans de començar. Els nous autònoms poden demanar la tarifa plana.',
    cost: 0, real: 'el mateix dia', segonsJoc: 4,
  },
  comunicacio: {
    nom: 'Comunicació d\'inici d\'activitat',
    on: 'Ajuntament, a través de la Finestreta Única Empresarial (FUE)',
    que: 'Amb la Llei 18/2020 de facilitació de l\'activitat econòmica, la majoria d\'activitats poden començar només comunicant-ho i pagant la taxa municipal. Algunes necessiten un certificat tècnic.',
    cost: 180, real: 'immediat en pagar la taxa', segonsJoc: 6,
  },
};

// Estatuts: model oficial (barat) o a mida (advocat)
export const OPCIONS_ESTATUTS = {
  tipus: { nom: 'Estatuts tipus (model oficial, per CIRCE)', cost: 0, text: 'Gratis i ràpid. Per a una SL amb capital fins a 3.100 €, la notaria i el registre tenen tarifes reduïdes (60 € i 40 €).' },
  mida: { nom: 'Estatuts a mida (advocat)', cost: 450, text: 'Un advocat els redacta pensant en el teu cas (pactes entre socis, majories...). Més car i més lent.' },
};

// Oficines per llogar (domicili social i seu). Preu mensual.
export const OFICINES = {
  domicili: { nom: 'Domiciliació virtual', mensual: 40, fianca: 0, text: 'Només una adreça on reps el correu. Barata, però el banc i els clients en desconfien una mica.', confianca: 0.9 },
  coworking: { nom: 'Taula en un coworking', mensual: 250, fianca: 250, text: 'Un lloc de treball en un espai compartit, amb sala de reunions.', confianca: 1 },
  oficina: { nom: 'Oficina petita (40 m²)', mensual: 700, fianca: 1400, text: 'Oficina pròpia per a un equip petit. Fiança de 2 mesos.', confianca: 1.1 },
  local: { nom: 'Local a peu de carrer (90 m²)', mensual: 1300, fianca: 2600, text: 'Espai gran amb aparador. Fiança de 2 mesos.', confianca: 1.15 },
};

// Personal. Imports mensuals bruts (14 pagues prorratejades) i cotització de l'empresa.
export const SS_EMPRESA = 0.32; // ≈ contingències comunes, atur, FOGASA, formació, MEI i accidents
export const PERSONAL = {
  operari: { nom: 'Operari/ària de producció', sou: 1650, text: 'Fa funcionar els edificis. Cada edifici necessita 1 persona per nivell per produir.' },
  rrhh: { nom: 'Tècnic/a de recursos humans', sou: 2300, text: 'Porta les nòmines, contractes i la Seguretat Social del personal. Substitueix la gestoria laboral.' },
};

export const GESTORIA = {
  fixe: 120,          // € al mes
  perTreballador: 35, // € al mes per cada nòmina
  text: 'La gestoria et porta els impostos trimestrals (IVA, IRPF), la comptabilitat i, si tens personal, les nòmines i la Seguretat Social.',
};

// Sense gestoria ni assessorament, cada setmana hi ha risc de fer tard un impost
export const RISC_SANCIO = { probabilitat: 0.2, import: 200, text: 'Sanció d\'Hisenda per presentar tard el model 303 de l\'IVA.' };

export const COST_ALTA_OCUPADOR = 0; // inscripció de l'empresa a la Seguretat Social (gratuïta)

// Sectors per triar l'activitat (epígraf IAE orientatiu)
export const SECTORS = {
  agro: { nom: 'Agroalimentari (pa, vi, oli...)', iae: 'Epígraf 419 - Indústries de pa, brioixeria i pastisseria (orientatiu)' },
  energia: { nom: 'Energia i aigua', iae: 'Epígraf 151 - Producció d\'energia elèctrica (orientatiu)' },
  construccio: { nom: 'Materials de construcció', iae: 'Epígraf 241 - Fabricació de maons i materials de construcció (orientatiu)' },
};

export function costTramit(id, forma, capital, estatutsTipus) {
  const c = TRAMITS[id].cost;
  return typeof c === 'function' ? c(forma, capital, estatutsTipus) : c;
}
