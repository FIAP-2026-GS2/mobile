// API simulada SOMENTE para desenvolvimento do app enquanto a API Java não está no ar.
// Segue o mesmo contrato descrito em docs/API.md. Dados ficam em memória e somem ao reiniciar.
// Uso: npm run mock-api  (porta 8080, ou PORT=xxxx)

import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';

const PORT = Number(process.env.PORT ?? 8080);

// ---------- Dados de exemplo ----------

let nextId = 1000;
const newId = () => ++nextId;
const now = () => new Date().toISOString();
const daysAgo = (days) => new Date(Date.now() - days * 86400000).toISOString();

const users = [
  {
    id: 1,
    name: 'Ana Cidadã',
    email: 'cidadao@teste.com',
    password: 'senha123',
    userType: 'CITIZEN',
    registrationDate: daysAgo(40),
  },
  {
    id: 2,
    name: 'Bruno Gestor',
    email: 'gestor@teste.com',
    password: 'senha123',
    userType: 'MANAGER',
    registrationDate: daysAgo(120),
  },
];

const issueTypes = [
  {
    id: 1,
    name: 'Poste apagado',
    category: 'Iluminação',
    description: 'Lâmpada queimada ou sem energia',
  },
  {
    id: 2,
    name: 'Buraco na via',
    category: 'Pavimentação',
    description: 'Buraco ou afundamento no asfalto',
  },
  {
    id: 3,
    name: 'Semáforo com defeito',
    category: 'Trânsito',
    description: 'Semáforo apagado ou piscando',
  },
  { id: 4, name: 'Fiação exposta', category: 'Iluminação', description: 'Cabos soltos ou caídos' },
  { id: 5, name: 'Lixo acumulado', category: 'Limpeza urbana', description: 'Descarte irregular' },
];

const points = [
  {
    id: 1,
    street: 'Av. Paulista',
    streetNumber: '1578',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    latitude: -23.5614,
    longitude: -46.6559,
    description: 'Poste em frente ao MASP',
  },
  {
    id: 2,
    street: 'R. Augusta',
    streetNumber: '900',
    neighborhood: 'Consolação',
    city: 'São Paulo',
    latitude: -23.5533,
    longitude: -46.6577,
    description: 'Cruzamento com R. Costa',
  },
  {
    id: 3,
    street: 'Av. Sapopemba',
    streetNumber: '4200',
    neighborhood: 'Sapopemba',
    city: 'São Paulo',
    latitude: -23.5986,
    longitude: -46.5133,
    description: 'Trecho da faixa de ônibus',
  },
  {
    id: 4,
    street: 'Av. Inajar de Souza',
    streetNumber: '1000',
    neighborhood: 'Freguesia do Ó',
    city: 'São Paulo',
    latitude: -23.4889,
    longitude: -46.6825,
    description: 'Semáforo da passarela',
  },
];

const cameras = [
  {
    id: 1,
    cameraCode: 'CAM-BV-0142',
    description: 'Câmera de esquina, PTZ',
    status: 'ACTIVE',
    monitoringPoint: points[0],
  },
  {
    id: 2,
    cameraCode: 'CAM-CS-0087',
    description: 'Câmera de comércio parceiro',
    status: 'ACTIVE',
    monitoringPoint: points[1],
  },
  {
    id: 3,
    cameraCode: 'CAM-SP-1203',
    description: 'Câmera de corredor de ônibus',
    status: 'ACTIVE',
    monitoringPoint: points[2],
  },
  {
    id: 4,
    cameraCode: 'CAM-FO-0331',
    description: 'Câmera fixa de cruzamento',
    status: 'MAINTENANCE',
    monitoringPoint: points[3],
  },
];

const schedules = [
  {
    id: 1,
    frequency: 'WEEKLY',
    weekday: 1,
    dayOfMonth: null,
    executionTime: '22:00',
    startDate: '2026-10-01',
    endDate: null,
    isActive: true,
    cameraId: 1,
  },
  {
    id: 2,
    frequency: 'MONTHLY',
    weekday: null,
    dayOfMonth: 5,
    executionTime: '10:30',
    startDate: '2026-09-05',
    endDate: null,
    isActive: true,
    cameraId: 3,
  },
  {
    id: 3,
    frequency: 'WEEKLY',
    weekday: 4,
    dayOfMonth: null,
    executionTime: '19:00',
    startDate: '2026-10-15',
    endDate: '2027-03-31',
    isActive: false,
    cameraId: 4,
  },
];

const history = (entries) => entries.map((entry) => ({ id: newId(), ...entry }));

const issues = [
  {
    id: 1,
    title: 'Poste apagado em frente ao MASP',
    description: 'A luz está apagada há três noites, a calçada fica muito escura.',
    source: 'CITIZEN',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    openingDate: daysAgo(3),
    resolutionDate: null,
    issueTypeId: 1,
    monitoringPointId: 1,
    userId: 1,
    detection: null,
    history: history([
      {
        previousStatus: null,
        newStatus: 'OPEN',
        notes: 'Relato criado pelo cidadão.',
        changeDate: daysAgo(3),
        changedBy: 'Ana Cidadã',
      },
      {
        previousStatus: 'OPEN',
        newStatus: 'IN_PROGRESS',
        notes: 'Equipe da Ilume acionada.',
        changeDate: daysAgo(1),
        changedBy: 'Bruno Gestor',
      },
    ]),
  },
  {
    id: 2,
    title: 'Buraco na faixa de ônibus',
    description: 'Afundamento de cerca de 40 cm detectado na captura mensal.',
    source: 'CAMERA',
    severity: 'MEDIUM',
    status: 'OPEN',
    openingDate: daysAgo(6),
    resolutionDate: null,
    issueTypeId: 2,
    monitoringPointId: 3,
    userId: null,
    detection: {
      id: 10,
      confidenceScore: 0.91,
      estimatedSeverity: 'MEDIUM',
      description:
        'Imagem mostra depressão circular no asfalto da faixa exclusiva, com acúmulo de água ao redor.',
      aiModel: 'YOLOv8-zeladoria',
      imageUrl: null,
    },
    history: history([
      {
        previousStatus: null,
        newStatus: 'OPEN',
        notes: 'Detecção confirmada pelo gestor.',
        changeDate: daysAgo(6),
        changedBy: 'Bruno Gestor',
      },
    ]),
  },
  {
    id: 3,
    title: 'Semáforo piscando no amarelo',
    description: 'Semáforo da passarela fica piscando à noite.',
    source: 'CITIZEN',
    severity: 'CRITICAL',
    status: 'RESOLVED',
    openingDate: daysAgo(15),
    resolutionDate: daysAgo(12),
    issueTypeId: 3,
    monitoringPointId: 4,
    userId: 1,
    detection: null,
    history: history([
      {
        previousStatus: null,
        newStatus: 'OPEN',
        notes: 'Relato criado pelo cidadão.',
        changeDate: daysAgo(15),
        changedBy: 'Ana Cidadã',
      },
      {
        previousStatus: 'OPEN',
        newStatus: 'RESOLVED',
        notes: 'CET trocou o controlador.',
        changeDate: daysAgo(12),
        changedBy: 'Bruno Gestor',
      },
    ]),
  },
];

const detections = [
  {
    id: 10,
    confidenceScore: 0.91,
    estimatedSeverity: 'MEDIUM',
    description: issues[1].detection.description,
    aiModel: 'YOLOv8-zeladoria',
    imageUrl: null,
    reviewStatus: 'CONFIRMED',
    detectionCoordinates: '412,280,610,402',
    analysis: { modelVersion: '1.2', analysisDate: daysAgo(6), processingTimeMs: 840 },
    captureId: 100,
    cameraId: 3,
    captureDate: daysAgo(6),
    suggestedIssueTypeId: 2,
    issueReportId: 2,
  },
  {
    id: 11,
    confidenceScore: 0.87,
    estimatedSeverity: 'HIGH',
    description:
      'Captura noturna mostra o poste sem iluminação enquanto os vizinhos estão acesos. Provável lâmpada queimada.',
    aiModel: 'YOLOv8-zeladoria',
    imageUrl: null,
    reviewStatus: 'PENDING',
    detectionCoordinates: '220,40,300,380',
    analysis: { modelVersion: '1.2', analysisDate: daysAgo(1), processingTimeMs: 760 },
    captureId: 101,
    cameraId: 1,
    captureDate: daysAgo(1),
    suggestedIssueTypeId: 1,
    issueReportId: null,
  },
  {
    id: 12,
    confidenceScore: 0.54,
    estimatedSeverity: 'LOW',
    description:
      'Possível acúmulo de sacos de lixo junto ao poste. Sombra pode ter confundido a análise.',
    aiModel: 'YOLOv8-zeladoria',
    imageUrl: null,
    reviewStatus: 'PENDING',
    detectionCoordinates: '80,300,240,420',
    analysis: { modelVersion: '1.2', analysisDate: daysAgo(2), processingTimeMs: 910 },
    captureId: 102,
    cameraId: 2,
    captureDate: daysAgo(2),
    suggestedIssueTypeId: 5,
    issueReportId: null,
  },
];

const tokens = new Map(); // token -> userId
const idempotency = new Map(); // chave -> resposta já enviada

// ---------- Montagem dos DTOs ----------

const findCamera = (id) => cameras.find((camera) => camera.id === id);
const issueDto = (issue) => {
  const reporter = users.find((user) => user.id === issue.userId);
  return {
    ...issue,
    issueType: issueTypes.find((type) => type.id === issue.issueTypeId),
    monitoringPoint: points.find((point) => point.id === issue.monitoringPointId) ?? null,
    reportedBy: reporter ? { id: reporter.id, name: reporter.name } : null,
  };
};
const scheduleDto = (schedule) => ({ ...schedule, camera: findCamera(schedule.cameraId) });
const detectionDto = (detection) => {
  const camera = findCamera(detection.cameraId);
  return {
    ...detection,
    capture: {
      id: detection.captureId,
      captureDate: detection.captureDate,
      camera: { id: camera.id, cameraCode: camera.cameraCode },
      monitoringPoint: camera.monitoringPoint,
    },
    suggestedIssueType:
      issueTypes.find((type) => type.id === detection.suggestedIssueTypeId) ?? null,
  };
};
const publicUser = ({ password: _password, ...user }) => user;

// ---------- Utilitários HTTP ----------

const send = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Idempotency-Key',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  });
  res.end(body === undefined ? '' : JSON.stringify(body));
};
const fail = (res, status, message, errors) => send(res, status, { status, message, errors });

const readBody = (req) =>
  new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });

const authenticate = (req) => {
  const token = (req.headers.authorization ?? '').replace('Bearer ', '');
  const userId = tokens.get(token);
  return users.find((user) => user.id === userId) ?? null;
};

const issueErrors = (body) => {
  const errors = {};
  if (!body.title || body.title.trim().length < 5) errors.title = 'Título muito curto.';
  if (!issueTypes.some((type) => type.id === body.issueTypeId))
    errors.issueTypeId = 'Tipo inválido.';
  if (!points.some((point) => point.id === body.monitoringPointId))
    errors.monitoringPointId = 'Local inválido.';
  if (!['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(body.severity))
    errors.severity = 'Gravidade inválida.';
  return errors;
};

const scheduleErrors = (body) => {
  const errors = {};
  if (!findCamera(body.cameraId)) errors.cameraId = 'Câmera inválida.';
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(body.executionTime ?? ''))
    errors.executionTime = 'Horário inválido.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.startDate ?? '')) errors.startDate = 'Data inválida.';
  return errors;
};

const pickSchedule = (body) => ({
  frequency: body.frequency,
  weekday: body.weekday ?? null,
  dayOfMonth: body.dayOfMonth ?? null,
  executionTime: body.executionTime,
  startDate: body.startDate,
  endDate: body.endDate ?? null,
  isActive: Boolean(body.isActive),
  cameraId: body.cameraId,
});

// ---------- Rotas ----------

async function handle(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const method = req.method;
  if (method === 'OPTIONS') return send(res, 204);

  // Idempotência: mesma chave em POST devolve a mesma resposta sem repetir a operação
  const idemKey = req.headers['idempotency-key'];
  if (method === 'POST' && idemKey && idempotency.has(idemKey)) {
    const cached = idempotency.get(idemKey);
    return send(res, cached.status, cached.body);
  }
  const reply = (status, body) => {
    if (method === 'POST' && idemKey) idempotency.set(idemKey, { status, body });
    return send(res, status, body);
  };

  const body = ['POST', 'PUT', 'PATCH'].includes(method) ? await readBody(req) : {};

  // --- autenticação (pública) ---
  if (path === '/auth/login' && method === 'POST') {
    const user = users.find((item) => item.email === String(body.email ?? '').toLowerCase());
    if (!user || user.password !== body.password)
      return fail(res, 401, 'E-mail ou senha incorretos.');
    const token = randomBytes(24).toString('hex');
    tokens.set(token, user.id);
    return reply(200, { token, user: publicUser(user) });
  }
  if (path === '/auth/register' && method === 'POST') {
    const email = String(body.email ?? '').toLowerCase();
    if (users.some((item) => item.email === email)) {
      return fail(res, 409, 'Este e-mail já está cadastrado.', { email: 'E-mail já cadastrado.' });
    }
    if (!body.name || !email || String(body.password ?? '').length < 8)
      return fail(res, 400, 'Dados inválidos.');
    const user = {
      id: newId(),
      name: body.name,
      email,
      password: body.password,
      userType: 'CITIZEN',
      registrationDate: now(),
    };
    users.push(user);
    const token = randomBytes(24).toString('hex');
    tokens.set(token, user.id);
    return reply(201, { token, user: publicUser(user) });
  }

  // --- daqui para baixo exige token ---
  const user = authenticate(req);
  if (!user) return fail(res, 401, 'Token ausente ou inválido.');
  const isManager = user.userType === 'MANAGER';
  const managerOnly = () => fail(res, 403, 'Apenas gestores podem acessar este recurso.');

  if (path === '/auth/me' && method === 'GET') return send(res, 200, publicUser(user));
  if (path === '/issue-types' && method === 'GET') return send(res, 200, issueTypes);
  if (path === '/monitoring-points' && method === 'GET') return send(res, 200, points);

  if (path === '/dashboard/summary' && method === 'GET') {
    const count = (status) => issues.filter((issue) => issue.status === status).length;
    return send(res, 200, {
      openIssues: count('OPEN'),
      inProgressIssues: count('IN_PROGRESS'),
      resolvedIssues: count('RESOLVED'),
      pendingDetections: detections.filter((item) => item.reviewStatus === 'PENDING').length,
      activeSchedules: schedules.filter((item) => item.isActive).length,
      myOpenIssues: issues.filter(
        (issue) => issue.userId === user.id && ['OPEN', 'IN_PROGRESS'].includes(issue.status),
      ).length,
    });
  }

  // --- ocorrências ---
  if (path === '/issue-reports' && method === 'GET') {
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 10);
    const status = url.searchParams.get('status');
    const mine = url.searchParams.get('mine') === 'true';
    const filtered = issues
      .filter((issue) => !status || issue.status === status)
      .filter((issue) => !mine || issue.userId === user.id)
      .sort((a, b) => b.openingDate.localeCompare(a.openingDate));
    const content = filtered.slice(page * size, page * size + size).map(issueDto);
    const totalPages = Math.max(1, Math.ceil(filtered.length / size));
    return send(res, 200, {
      content,
      totalElements: filtered.length,
      totalPages,
      number: page,
      size,
      last: page >= totalPages - 1,
    });
  }
  if (path === '/issue-reports' && method === 'POST') {
    const errors = issueErrors(body);
    if (Object.keys(errors).length) return fail(res, 400, 'Confira os dados informados.', errors);
    const issue = {
      id: newId(),
      title: body.title,
      description: body.description ?? null,
      source: 'CITIZEN',
      severity: body.severity,
      status: 'OPEN',
      openingDate: now(),
      resolutionDate: null,
      issueTypeId: body.issueTypeId,
      monitoringPointId: body.monitoringPointId,
      userId: user.id,
      detection: null,
      history: history([
        {
          previousStatus: null,
          newStatus: 'OPEN',
          notes: 'Relato criado pelo cidadão.',
          changeDate: now(),
          changedBy: user.name,
        },
      ]),
    };
    issues.push(issue);
    return reply(201, issueDto(issue));
  }

  const issueMatch = path.match(/^\/issue-reports\/(\d+)(\/status)?$/);
  if (issueMatch) {
    const issue = issues.find((item) => item.id === Number(issueMatch[1]));
    if (!issue) return fail(res, 404, 'Ocorrência não encontrada.');
    const isOwner = issue.userId === user.id;

    if (issueMatch[2] && method === 'PATCH') {
      if (!isManager) return managerOnly();
      if (!['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED'].includes(body.status))
        return fail(res, 400, 'Status inválido.');
      issue.history.push({
        id: newId(),
        previousStatus: issue.status,
        newStatus: body.status,
        notes: body.notes || null,
        changeDate: now(),
        changedBy: user.name,
      });
      issue.status = body.status;
      issue.resolutionDate = body.status === 'RESOLVED' ? now() : issue.resolutionDate;
      return send(res, 200, issueDto(issue));
    }
    if (method === 'GET') return send(res, 200, issueDto(issue));
    if (method === 'PUT') {
      if (!isOwner || issue.status !== 'OPEN')
        return fail(res, 403, 'Só é possível editar seus relatos ainda abertos.');
      const errors = issueErrors(body);
      if (Object.keys(errors).length) return fail(res, 400, 'Confira os dados informados.', errors);
      Object.assign(issue, {
        title: body.title,
        description: body.description,
        severity: body.severity,
        issueTypeId: body.issueTypeId,
        monitoringPointId: body.monitoringPointId,
      });
      return send(res, 200, issueDto(issue));
    }
    if (method === 'DELETE') {
      if (!isOwner || issue.status !== 'OPEN')
        return fail(res, 403, 'Só é possível excluir seus relatos ainda abertos.');
      issues.splice(issues.indexOf(issue), 1);
      return send(res, 204);
    }
  }

  // --- gestor: câmeras, agendas e detecções ---
  if (
    ['/cameras', '/capture-schedules', '/ai-detections'].some((prefix) =>
      path.startsWith(prefix),
    ) &&
    !isManager
  ) {
    return managerOnly();
  }
  if (path === '/cameras' && method === 'GET') return send(res, 200, cameras);

  if (path === '/capture-schedules' && method === 'GET')
    return send(res, 200, schedules.map(scheduleDto));
  if (path === '/capture-schedules' && method === 'POST') {
    const errors = scheduleErrors(body);
    if (Object.keys(errors).length) return fail(res, 400, 'Confira os dados informados.', errors);
    const schedule = { id: newId(), ...pickSchedule(body) };
    schedules.push(schedule);
    return reply(201, scheduleDto(schedule));
  }
  const scheduleMatch = path.match(/^\/capture-schedules\/(\d+)$/);
  if (scheduleMatch) {
    const schedule = schedules.find((item) => item.id === Number(scheduleMatch[1]));
    if (!schedule) return fail(res, 404, 'Agenda não encontrada.');
    if (method === 'GET') return send(res, 200, scheduleDto(schedule));
    if (method === 'PUT') {
      const errors = scheduleErrors(body);
      if (Object.keys(errors).length) return fail(res, 400, 'Confira os dados informados.', errors);
      Object.assign(schedule, pickSchedule(body));
      return send(res, 200, scheduleDto(schedule));
    }
    if (method === 'DELETE') {
      schedules.splice(schedules.indexOf(schedule), 1);
      return send(res, 204);
    }
  }

  if (path === '/ai-detections' && method === 'GET') {
    const reviewStatus = url.searchParams.get('reviewStatus');
    return send(
      res,
      200,
      detections
        .filter((item) => !reviewStatus || item.reviewStatus === reviewStatus)
        .map(detectionDto),
    );
  }
  const detectionMatch = path.match(/^\/ai-detections\/(\d+)(\/confirm|\/dismiss)?$/);
  if (detectionMatch) {
    const detection = detections.find((item) => item.id === Number(detectionMatch[1]));
    if (!detection) return fail(res, 404, 'Detecção não encontrada.');
    if (!detectionMatch[2] && method === 'GET') return send(res, 200, detectionDto(detection));
    if (detection.reviewStatus !== 'PENDING')
      return fail(res, 409, 'Esta detecção já foi revisada.');
    if (detectionMatch[2] === '/dismiss' && method === 'POST') {
      detection.reviewStatus = 'DISMISSED';
      return reply(200, detectionDto(detection));
    }
    if (detectionMatch[2] === '/confirm' && method === 'POST') {
      const camera = findCamera(detection.cameraId);
      const type =
        issueTypes.find((item) => item.id === detection.suggestedIssueTypeId) ?? issueTypes[0];
      const issue = {
        id: newId(),
        title: `${type.name} – ${camera.monitoringPoint.street}`,
        description: detection.description,
        source: 'CAMERA',
        severity: detection.estimatedSeverity,
        status: 'OPEN',
        openingDate: now(),
        resolutionDate: null,
        issueTypeId: type.id,
        monitoringPointId: camera.monitoringPoint.id,
        userId: null,
        detection: {
          id: detection.id,
          confidenceScore: detection.confidenceScore,
          estimatedSeverity: detection.estimatedSeverity,
          description: detection.description,
          aiModel: detection.aiModel,
          imageUrl: detection.imageUrl,
        },
        history: history([
          {
            previousStatus: null,
            newStatus: 'OPEN',
            notes: 'Detecção confirmada pelo gestor.',
            changeDate: now(),
            changedBy: user.name,
          },
        ]),
      };
      issues.push(issue);
      detection.reviewStatus = 'CONFIRMED';
      detection.issueReportId = issue.id;
      return reply(201, issueDto(issue));
    }
  }

  return fail(res, 404, `Rota ${method} ${path} não existe na API simulada.`);
}

createServer((req, res) => {
  handle(req, res).catch((error) => {
    console.error(error);
    fail(res, 500, 'Erro interno na API simulada.');
  });
}).listen(PORT, () => {
  console.log(`API simulada em http://localhost:${PORT}`);
  console.log('Usuários: cidadao@teste.com / gestor@teste.com (senha: senha123)');
});
