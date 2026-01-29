import { Email, Folder } from "@/types/email";

export const mockFolders: Folder[] = [
  { id: "inbox", name: "Caixa de Entrada", icon: "Inbox", count: 156, unread: 12 },
  { id: "sent", name: "Enviados", icon: "Send", count: 45, unread: 0 },
  { id: "drafts", name: "Rascunhos", icon: "FileEdit", count: 3, unread: 0 },
  { id: "starred", name: "Com Estrela", icon: "Star", count: 8, unread: 0 },
  { id: "spam", name: "Spam", icon: "ShieldAlert", count: 23, unread: 23 },
  { id: "trash", name: "Lixeira", icon: "Trash2", count: 12, unread: 0 },
];

export const mockEmails: Email[] = [
  {
    id: "1",
    from: { name: "Carlos Silva", email: "carlos.silva@empresa.com.br" },
    to: [{ name: "Você", email: "usuario@webmail.com.br" }],
    subject: "Relatório Mensal - Janeiro 2024",
    body: `Olá,

Segue em anexo o relatório mensal de Janeiro de 2024. Os principais pontos a destacar são:

1. Crescimento de 15% nas vendas em relação ao mês anterior
2. Redução de 8% nos custos operacionais
3. Novos contratos assinados: 12

Por favor, revise os dados e me avise se precisar de alguma informação adicional.

Atenciosamente,
Carlos Silva
Diretor Financeiro`,
    date: new Date(2024, 0, 28, 14, 30),
    isRead: false,
    isStarred: true,
    hasAttachment: true,
    folder: "inbox",
    attachments: [
      { id: "a1", name: "relatorio_janeiro_2024.pdf", size: 2450000, type: "application/pdf" },
    ],
  },
  {
    id: "2",
    from: { name: "Recursos Humanos", email: "rh@empresa.com.br" },
    to: [{ name: "Você", email: "usuario@webmail.com.br" }],
    subject: "Férias Coletivas - Comunicado Importante",
    body: `Prezados colaboradores,

Informamos que as férias coletivas serão realizadas no período de 20/12 a 03/01.

Lembramos que todos os pendências devem ser finalizadas antes do recesso.

Atenciosamente,
Departamento de Recursos Humanos`,
    date: new Date(2024, 0, 28, 10, 15),
    isRead: false,
    isStarred: false,
    hasAttachment: false,
    folder: "inbox",
  },
  {
    id: "3",
    from: { name: "Sistema de TI", email: "noreply@ti.empresa.com.br" },
    to: [{ name: "Você", email: "usuario@webmail.com.br" }],
    subject: "Manutenção Programada dos Servidores",
    body: `Informamos que haverá manutenção programada nos servidores no próximo sábado, das 22h às 06h.

Durante este período, os seguintes serviços estarão indisponíveis:
- Email corporativo
- Sistema ERP
- Portal do colaborador

Pedimos desculpas por qualquer inconveniente.

Equipe de TI`,
    date: new Date(2024, 0, 27, 16, 45),
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    folder: "inbox",
  },
  {
    id: "4",
    from: { name: "Ana Costa", email: "ana.costa@parceiro.com.br" },
    to: [{ name: "Você", email: "usuario@webmail.com.br" }],
    subject: "Re: Proposta Comercial - Projeto ABC",
    body: `Boa tarde,

Agradeço pelo envio da proposta. Analisamos internamente e gostaríamos de agendar uma reunião para discutir alguns pontos.

Você teria disponibilidade na próxima terça-feira às 14h?

Abraços,
Ana Costa
Gerente de Compras`,
    date: new Date(2024, 0, 27, 11, 20),
    isRead: true,
    isStarred: true,
    hasAttachment: false,
    folder: "inbox",
  },
  {
    id: "5",
    from: { name: "Newsletter Tech", email: "newsletter@tech.news" },
    to: [{ name: "Você", email: "usuario@webmail.com.br" }],
    subject: "As 10 principais tendências de tecnologia para 2024",
    body: `Confira as principais tendências tecnológicas que vão dominar o mercado em 2024:

1. Inteligência Artificial Generativa
2. Computação Quântica
3. Edge Computing
4. 5G e 6G
5. Blockchain e Web3
6. Cibersegurança Avançada
7. IoT Industrial
8. Realidade Estendida
9. Sustentabilidade Digital
10. Low-Code/No-Code

Clique para ler a matéria completa.`,
    date: new Date(2024, 0, 26, 9, 0),
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    folder: "inbox",
  },
  {
    id: "6",
    from: { name: "Você", email: "usuario@webmail.com.br" },
    to: [{ name: "Cliente", email: "cliente@external.com" }],
    subject: "Orçamento Solicitado",
    body: `Prezado Cliente,

Conforme solicitado, segue o orçamento para os serviços.

Ficamos à disposição para qualquer dúvida.

Atenciosamente.`,
    date: new Date(2024, 0, 25, 15, 30),
    isRead: true,
    isStarred: false,
    hasAttachment: true,
    folder: "sent",
    attachments: [
      { id: "a2", name: "orcamento_2024.xlsx", size: 156000, type: "application/vnd.ms-excel" },
    ],
  },
  {
    id: "7",
    from: { name: "Você", email: "usuario@webmail.com.br" },
    to: [{ name: "Equipe", email: "equipe@empresa.com.br" }],
    subject: "Reunião de Alinhamento - Pauta",
    body: `Olá equipe,

Segue a pauta da reunião de amanhã:
- Revisão de metas
- Status dos projetos
- Próximos passos

Abraços.`,
    date: new Date(2024, 0, 24, 10, 0),
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    folder: "sent",
  },
];
