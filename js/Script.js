document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const elements = {
        userInput: document.getElementById('user-input'),
        sendBtn: document.getElementById('send-btn'),
        micBtn: document.getElementById('mic-btn'),
        chatMessages: document.getElementById('chatbot-messages'),
        quickQuestions: document.querySelectorAll('.quick-question'),
        minimizeBtn: document.querySelector('.minimize-btn'),
        chatbotWidget: document.querySelector('.chatbot-widget'),
        chatbotInput: document.querySelector('.chatbot-input'),
        quickQuestionsContainer: document.querySelector('.quick-questions')
    };
    
    // Estado del chatbot
    const state = {
        isMinimized: false,
        isListening: false,
        isRating: false,
        ratings: JSON.parse(localStorage.getItem('chatbotRatings')) || []
    };
    
    // Respuestas predefinidas del chatbot
    const botResponses = {
        greeting: "¡Hola! Soy tu asistente virtual del Banco Digital. ¿En qué puedo ayudarte hoy?",
        
        // Cuentas bancarias
        openAccount: `Para abrir una cuenta bancaria necesitas:
- Documento de identidad vigente
- Comprobante de domicilio reciente (no mayor a 2 meses)
- Comprobante de ingresos (para algunos tipos de cuenta)
El proceso toma aproximadamente 20 minutos en sucursal.`,
        accountTypes: `Ofrecemos estos tipos de cuentas:
1. Cuenta de ahorros básica (sin costo para menores de $50,000)
2. Cuenta corriente ($8,000/mes de mantenimiento)
3. Cuenta de nómina (sin costo si el depósito mínimo es $1'000,000/mes)
4. Cuenta empresarial ($15,000/mes)`,
        accountCost: `El costo de mantenimiento depende del tipo de cuenta:
- Básica: $0 a $5,000 mensuales
- Gold: $8,000 mensuales
- Platinum: $12,000 mensuales
- Empresarial: $15,000 a $30,000 mensuales
Algunas están exentas con saldo promedio mensual mínimo.`,
        
        // Tarjetas
        creditCardApply: `Puedes solicitar una tarjeta de crédito:
1. En línea: Visita nuestra página de tarjetas
2. En la app: Sección 'Solicitar productos'
3. En sucursal: Con un asesor
Requieres mínimo 6 meses con cuenta activa y buen historial crediticio.`,
        cardLost: `Si pierdes tu tarjeta bancaria:
1. Llama inmediatamente al 018000-123456 (24/7)
2. Bloquéala desde la app móvil
3. Solicita reposición en sucursal (costo $15,000)
El bloqueo es instantáneo para proteger tus fondos.`,
        cardBlock: `Para bloquear tu tarjeta por robo:
1. App móvil: Ve a 'Tarjetas' > 'Bloquear'
2. Línea 24/7: 018000-123456
3. Sucursal: Con tu documento de identidad
Te emitiremos una nueva en 3-5 días hábiles.`,
        internationalCard: `Para activar compras internacionales:
1. App móvil: 'Tarjetas' > 'Configuración' > 'Habilitar internacional'
2. Banca en línea: Sección 'Seguridad'
3. Llama al servicio al cliente
Recomendamos activar solo cuando viajes por seguridad.`,
        
        // Créditos
        loanRequirements: `Para préstamo personal necesitas:
- Documento de identidad
- 3 últimos comprobantes de ingresos
- Declaración de renta (si ganas más de $50'000,000/año)
- Historial crediticio (puntaje mínimo 650)`,
        mortgageRate: `Tasas actuales para crédito hipotecario:
- Vivienda VIS (hasta 500 SMMLV): 9% EA
- Vivienda no VIS: 11% EA
- Segunda vivienda: 13% EA
Sujeto a estudio de crédito y plazo (hasta 20 años).`,
        creditLimit: `Para aumentar tu límite de crédito:
1. App móvil: 'Tarjetas' > 'Solicitar aumento'
2. Banca en línea: 'Productos' > 'Tarjetas'
3. Sucursal: Con asesor
Consideramos tus ingresos, historial y capacidad de pago.`,
        carLoan: `Para crédito vehicular:
- Documento de identidad
- Comprobantes de ingresos
- Cotización del vehículo
- Historial crediticio
Tasas desde 10% EA, plazos hasta 5 años.`,
        refinance: `Opciones de refinanciación:
1. Extensión de plazo (reduce cuota mensual)
2. Consolidación de deudas
3. Reducción de tasa (sujeto a aprobación)
Agenda cita con un asesor para evaluación.`,
        
        // Ahorros e inversiones
        savingsOptions: `Opciones de ahorro:
1. Cuenta de ahorros (0.5% EA)
2. CDT (desde 6% EA a 12 meses)
3. Fondos de inversión colectiva
4. Cartera colectiva
5. Divisas (USD, EUR)`,
        cdtInfo: `Los CDT (Certificados de Depósito a Término):
- Inversión mínima: $500,000
- Plazos: 30 días a 5 años
- Interés: 6% a 9% EA según plazo
- Puedes renovar automáticamente`,
        investmentFunds: `Nuestros fondos de inversión:
1. Conservador (3% EA, bajo riesgo)
2. Moderado (6% EA)
3. Agresivo (10% EA potencial, alto riesgo)
Diversifican en acciones, bonos y más.`,
        
        // Impuestos y tarifas
        fourPerThousand: `El 4x1000 es un impuesto del 0.4% sobre:
- Retiros en efectivo > $1'300,000
- Transferencias > $5'000,000
No aplica para:
- Pagos de nómina
- Transferencias entre propias cuentas
- Pagos de créditos`,
        transferFees: `Tarifas por transferencias:
- Propias cuentas: $0
- Mismo banco: $1,000
- Otros bancos nacionales:
  * $3,000 (hasta $500,000)
  * $5,000 ($500,001 a $2'000,000)
  * $10,000 (más de $2'000,000)`,
        
        // Banca digital
        onlineAccess: `Para acceder a tu cuenta en línea:
1. Registra tu número de cliente
2. Crea contraseña segura (8-16 caracteres)
3. Configura autenticación doble
4. Descarga la app móvil para token digital`,
        resetPassword: `Si olvidaste tu contraseña:
1. Haz clic en "¿Olvidaste tu contraseña?"
2. Ingresa tu número de documento
3. Recibirás SMS/correo con enlace
4. Crea nueva contraseña
Si tienes problemas, llama al 018000-123456`,
        mobileBanking: `Beneficios de la banca móvil:
- Transferencias 24/7
- Pago de servicios
- Consulta de saldos
- Bloqueo de tarjetas
- Inversiones
- Solicitud de productos
- Chat con asesores`,
        
        // Seguridad
        unauthorizedCharge: `Si ves cargos no reconocidos:
1. Bloquea tu tarjeta inmediatamente
2. Reporta en app/banca en línea
3. Llama al 018000-123456
4. Presenta reclamo formal en 72 horas
Investigaremos y reembolsaremos si es fraude.`,
        suspiciousEmail: `Si recibes correo sospechoso:
1. No descargues archivos
2. No hagas clic en enlaces
3. Verifica remitente (dominio @bancodigital.com)
4. Reporta a seguridad@bancodigital.com
Nunca te pediremos claves por correo.`,
        
        // Empresas
        businessAccount: `Para cuenta empresarial necesitas:
- NIT de la empresa
- Cédula del representante legal
- Certificado de existencia y representación
- Comprobante de domicilio
- Estados financieros (para ciertos productos)`,
        businessLoan: `Crédito para negocios requiere:
1. Documentación legal completa
2. Estados financieros 2 años
3. Flujo de caja proyectado
4. Garantías (según monto)
Tasas desde 12% EA, plazos hasta 10 años.`,
        
        // Seguros
        insuranceOptions: `Ofrecemos estos seguros:
1. Vida (obligatorio con créditos)
2. Hogar (cubre robo, incendio, daños)
3. Vehículo (todo riesgo o cobertura básica)
4. Protección de pagos (cubre cuotas si desempleo)
5. Salud (medicina prepagada)`,
        
        // Quejas y soporte
        complaints: `Para presentar quejas:
1. Intenta resolver con servicio al cliente
2. Si no hay solución en 15 días:
   - Sucursal: Solicita formulario PQRS
   - En línea: www.bancodigital.com/quejas
   - Superintendencia Financiera
Plazo máximo de respuesta: 30 días.`,
        blockedAccount: `Si tu cuenta está bloqueada:
1. Verifica si hay documentos pendientes
2. Confirma tu identidad en sucursal
3. Si fue por seguridad, llama al 018000-123456
4. Sigue instrucciones para desbloquear
Normalmente se resuelve en 24-48 horas.`,
        
        // Otros servicios
        autoPayments: `Para pagos automáticos:
1. App móvil: 'Pagos' > 'Programar'
2. Banca en línea: 'Servicios' > 'Pagos recurrentes'
3. Sucursal: Solicita formato
Puedes programar:
- Tarjeta de crédito
- Servicios públicos
- Préstamos`,
        transactionHistory: `Obtén tu historial de transacciones:
1. App/banca en línea: 'Consultas' > 'Historial'
   - Descarga hasta 12 meses
2. Sucursal: Solicita extractos (costo $2,000 por mes)
3. Cajeros: Últimos 15 movimientos gratis`,
        closeAccount: `Para cerrar tu cuenta:
1. Liquidar todos los productos asociados
2. Saldo $0 en la cuenta
3. Solicitud en sucursal con documento de identidad
4. Firmar documento de cierre
O en línea si no tienes productos activos.`,
        
        // Educación financiera
        financialEducation: `Te ofrecemos:
1. Talleres presenciales gratuitos
2. Webinars mensuales
3. Guías digitales en nuestra web
4. Asesoría personalizada
Temas: presupuesto, ahorro, inversión, crédito.`,
        
        // Despedidas y calificación
        farewell: `Gracias por usar nuestro chatbot. Queremos mejorar nuestro servicio, por favor califícanos del 1 al 5.
1. Muy malo
2. Malo
3. Regular
4. Bueno
5. Excelente
Si tienes más preguntas, no dudes en volver. ¡Hasta luego! 😊`,
        ratingThanks: (rating) => `¡Gracias por tu calificación de ${rating} estrellas! Tu opinión es muy valiosa para nosotros.`,
        invalidRating: `Por favor ingresa un número del 1 al 5 para calificarnos.`,
        
        // Nuevas respuestas basadas en las preguntas proporcionadas
        bankCharges: `Nuestro banco aplica los siguientes cargos comunes:
- Cargo mensual por mantenimiento de cuenta: $5,000 (exento con depósito directo de nómina o saldo promedio de $1'000,000)
- Cargo por sobregiro: $15,000 por transacción
- Cargo por transferencias a otros bancos: $3,000-$10,000 según monto
- Cargo por uso de cajeros no asociados: $2,500 por transacción
- Cargo por reposición de tarjeta: $12,150 más IVA

Puedes evitar muchos cargos manteniendo saldos mínimos o configurando depósitos directos.`,
        
        minimumBalance: `El saldo mínimo requerido depende del tipo de cuenta:
- Cuenta básica: $50,000
- Cuenta corriente: $300,000
- Cuenta de nómina: $0 (requiere depósito mínimo mensual de $1'000,000)
- Cuenta premium: $2'000,000

Si no mantienes el saldo mínimo, se aplicará un cargo mensual de $5,000 a $15,000 según el tipo de cuenta.`,
        
        atmFees: `Puedes usar nuestros cajeros automáticos de forma gratuita. Para cajeros de otros bancos:
- Primeros 3 retiros al mes: sin costo
- Retiros adicionales: $2,500 por transacción
- Consultas de saldo: $1,000 por transacción

Ofrecemos reembolso de hasta $10,000 mensuales en cargos por uso de cajeros externos para clientes premium.`,
        
        overdraftPolicy: `Nuestra política de sobregiros:
- Transacciones con fondos insuficientes: $15,000 de cargo por sobregiro
- Límite de sobregiro automático: $500,000 (sujeto a aprobación)
- Opción de protección contra sobregiros: Vincula tu cuenta de ahorros (cargo de $5,000 por transferencia de fondos)
- Puedes solicitar que las transacciones sean rechazadas sin cargo si prefieres no tener sobregiros.`,
        
        transferCosts: `Costos por transferencias:
- Transferencias entre cuentas propias: Gratis
- Transferencias a otros clientes del mismo banco: $1,000
- Transferencias a otros bancos nacionales: $3,000-$10,000 según monto
- Transferencias internacionales: 1% del monto (mínimo $20,000)
- Transferencias persona a persona (Zelle®): Gratis`,
        
        checksAndCards: `Costos por cheques y tarjetas:
- Primera chequera: Gratis
- Chequeras adicionales: $25,000
- Reposición de tarjeta de débito: $12,150 más IVA
- Reposición de tarjeta de crédito: $22,600
- Tarjetas vencidas: Reemplazo gratis`,
        
        interestRates: `Tasas de interés actuales:
- Cuentas de cheques: 0.1% EA
- Cuentas de ahorros: 1.5% EA
- CDT a 90 días: 6% EA
- CDT a 1 año: 8% EA
- Cuentas de alto rendimiento (requieren $5'000,000 mínimo): 3% EA`,
        
        accountRewards: `Nuestra cuenta de cheques ofrece estas recompensas:
- Bonificación de $50,000 al abrir cuenta nueva con depósito directo
- 1% de cashback en compras con tarjeta de débito (hasta $100,000 mensuales)
- Puntos canjeables por millas aéreas o descuentos
- Acceso preferencial a eventos y promociones`,
        
        savingsWithdrawal: `En nuestra cuenta de ahorros:
- Puedes disponer de la totalidad de tus fondos en cualquier momento
- No hay saldo mínimo obligatorio
- Primeros 5 retiros mensuales son gratis (luego $1,000 por retiro)
- Retiros ilimitados en cajeros propios`,
        
        nationalTransactions: `Puedes realizar transacciones en cualquier oficina del país:
- Consignaciones y retiros sin costo
- Transferencias entre cuentas propias: gratis
- Consultas de saldo y extractos: gratis
- También puedes usar corresponsales bancarios, Red Baloto y SuperGiros para depósitos y pagos`,
        
        savingsRequirements: `Para abrir una cuenta de ahorros solo necesitas:
- Documento de identidad original
- Visitar cualquier oficina a nivel nacional
- No se requiere monto mínimo de apertura
- Proceso toma menos de 15 minutos`,
        
        microcreditOptions: `Para saber qué microcrédito puedes solicitar:
1. Nuestros asesores visitarán tu negocio para evaluar necesidades
2. Analizaremos tu capacidad de pago
3. Te ofreceremos opciones adaptadas a tu flujo de caja
4. Puedes consultar nuestro portafolio en línea o en oficinas`,
        
        microcreditCosts: `Costos asociados a microcréditos:
- Interés corriente: 1.5% mensual
- Comisión Mipyme: 0.5% del valor
- Comisión de apertura: 1% del valor
- Seguro de vida: 0.2% mensual
- Gastos de cobranza en caso de mora`,
        
        creditGuarantees: `Si dejas de pagar un crédito con garantía:
- Con codeudor: Cobraremos al codeudor
- Con garantía de fondos especializados: Reclamaremos hasta 50% del saldo
- El cliente sigue responsable por el saldo restante
- Se iniciará proceso de cobro prejurídico`,
        
        earlyCancellation: `Puedes cancelar tu crédito anticipadamente:
- Sin penalidades por pago anticipado
- Abonos parciales reducen plazo o cuota
- Proceso en línea, app o sucursal
- Ahorras en intereses no causados`,
        
        loanDocuments: `Para obtener un préstamo necesitas:
- Documento de identidad
- Comprobantes de ingresos (3 últimos meses)
- Declaración de renta (si aplica)
- Referencias personales y bancarias
- Historial crediticio`,
        
        deniedCredit: `Si negamos tu crédito:
- Te explicaremos los motivos específicos
- Ofreceremos alternativas de solución
- Recomendaciones para mejorar tu perfil crediticio
- Puedes volver a aplicar después de 3 meses`,
        
        paymentAdvice: `Al pagar tu crédito:
- Ten a mano tu número de crédito
- Verifica fecha, monto y concepto
- Para cancelación total, confirma saldo exacto
- Guarda comprobante de pago
- Los pagos se reflejan en 24 horas hábiles`,
        
        debtConsolidation: `Para unificar deudas:
- Ofrecemos compra de cartera
- Reducción de tasa de interés posible
- Cuota única más manejable
- Mejora tu flujo de caja
- Solicita cita con un asesor crediticio`,
        
        cardBlocking: `Para bloquear tu tarjeta:
- Tarjeta de crédito: Contacta directamente a la franquicia
- Tarjeta débito: 
  * Portal web (con clave de internet)
  * Línea de atención 24/7
  * Asesor en sucursal
El bloqueo es definitivo (requiere nueva tarjeta)`,
        
        cardReplacement: `Costos de reposición:
- Tarjeta de crédito: $22,600
- Tarjeta débito: $12,150 + IVA
- Exento por vencimiento
- Entrega en 5 días hábiles
- Activación inmediata al recibir`,
        
        cardExpiration: `Para verificar vencimiento:
- Mira el frente de tu tarjeta débito
- Busca "Hasta/Thru" en esquina inferior derecha
- Mes y año indican fecha de vencimiento
- Te enviaremos nueva tarjeta 30 días antes`,
        
        onlinePurchases: `Actualmente:
- Estamos trabajando para habilitar compras online con tarjeta débito
- Mientras tanto, puedes usar:
  * Transferencias PSE
  * Tarjeta de crédito virtual
  * Pagos en establecimientos físicos`,
        
        contactlessSymbols: `Símbolos de ondas magnéticas:
- Indican tecnología de pagos sin contacto
- En tarjeta: Puedes pagar acercando al datáfono
- En comercio: Aceptan pagos contactless
- Más rápido y seguro que insertar tarjeta`,
        
        intlCardUse: `Para usar tu tarjeta fuera del país:
- Habilitada para compras y retiros internacionales
- Debes notificar tu viaje previamente
- Aceptada en establecimientos Visa worldwide
- Retiros en cajeros afiliados Visa/Plus
- Comisión del 2% por transacción en moneda extranjera`,
        
        travelNotification: `Antes de viajar:
- Notifica fechas y países de visita
- Puedes hacerlo por:
  * Línea de atención
  * App móvil
  * Sucursal
- Evita bloqueos por seguridad
- Verifica cobertura de seguros`,
        
        debitVsCredit: `Diferencias clave:
- Débito: Usa fondos disponibles en tu cuenta, sin intereses
- Crédito: Compra a crédito hasta tu límite, con intereses si no pagas total
- Débito: Transacciones instantáneas
- Crédito: Pago diferido (hasta fecha de corte)`,
        
        stolenCard: `Si te roban la tarjeta:
1. Bloquéala inmediatamente
2. Reporta el robo a la entidad
3. Presenta denuncia policial
4. Solicita reposición
Tu responsabilidad máxima es de $50 por cargos no autorizados antes del reporte`,
        
        cardFees: `Por pagar con tarjeta:
- Nunca te cobraremos comisión como consumidor
- Los costos por uso de datáfono son responsabilidad del comercio
- Puedes denunciar cobros indebidos
- Tarifas normales de tu tarjeta aplican`,
        
        instantTransfers: `Transferencias inmediatas:
- Sin costo adicional vs transferencia normal
- Procesamiento en menos de 10 segundos
- Disponible 24/7
- Límite de $20'000,000 por transacción
- Notificación instantánea al receptor`,
        
        pseService: `Servicio PSE:
- Botón de pago para compras online
- Usa fondos de tu cuenta de ahorros
- Registro único en plataforma
- Transacciones seguras y rápidas
- Sin costo para el comprador`,
        
        unrecognizedTransactions: `Para transacciones no reconocidas:
1. Comunícate con nuestra Línea Amiga #233
2. Selecciona opciones 2 y 1
3. Sigue instrucciones para reporte
4. Bloquea preventivamente tu tarjeta
Investigaremos y resolveremos en 72 horas`,
        
        twoFactorAuth: `Código de verificación móvil:
- Medida de seguridad obligatoria
- Combina algo que sabes (clave) y tienes (celular)
- Protege contra fraudes
- Proceso legal y estándar en banca
- Nunca compartas este código`,
        
        lostPhone: `Si pierdes tu celular con banca móvil:
1. Llama a Lineamía 01 8000 126 100
2. Solicita bloqueo del canal
3. Con nuevo celular, descarga nuevamente la app
4. Usa preguntas de seguridad o visita oficina
5. Configura nuevas medidas de seguridad`,
        
        feeComplaint: `Para reclamar comisiones:
1. Contacta atención al cliente
2. Si no hay solución en 1 mes, presenta reclamación formal
3. Banco de España emite informe (no vinculante)
4. Puedes acudir a tribunales si es necesario
Guarda toda la documentación relacionada`,
        
        complaintEffectiveness: `Reclamaciones ante Banco de España:
- Emiten informe motivado en 1-2 meses
- Entidades suelen rectificar voluntariamente
- No es vinculante pero sirve como prueba
- Puede derivar en inspecciones
- Contribuye a mejorar prácticas bancarias`,
        
        additionalChannels: `Canales de atención:
- Línea Amiga: 601 542 6446 (Bogotá) / 01 8000 910 038
- Banca por internet y móvil
- Cajeros automáticos
- Oficinas a nivel nacional
- Redes sociales y correo electrónico`,
        
        financialInclusion: `Inclusión financiera significa:
1. Acceso: Oportunidad de usar servicios financieros
2. Uso: Utilización efectiva y regular
3. Calidad: Productos adaptados, regulados y protectores
Nuestro banco promueve inclusión con productos para todos.`,
        
        transUnion: `TransUnion es:
- Central de riesgo crediticio
- Reporta tu historial positivo y negativo
- Beneficia al mostrar buen comportamiento
- Consulta gratis tu reporte:
  * En línea
  * Por teléfono
  * En oficinas`,
        
        deceasedAccount: `Si fallece un familiar con cuenta:
1. Presenta copia de registro civil de defunción
2. Documento que acredite calidad de heredero
3. Solicita saldo en oficina donde se abrió
4. Para saldos altos, documentos adicionales
Proceso tarda 5-10 días hábiles`,
        
        deceasedCredit: `Si fallece un deudor:
- Seguro de vida cubre saldo total (si activo)
- Presenta certificado de defunción
- Verifica requisitos de póliza
- Codeudores quedan liberados
- Sin afectar historial crediticio de herederos`,
        
        microcreditDefinition: `Microcrédito es:
- Financiamiento para microempresarios
- Endeudamiento máximo: 120 SMLMV
- Principal fuente de pago: ingresos de actividad productiva
- Plazos flexibles según flujo de caja`,
        
        microBusiness: `Tu negocio es microempresa si:
- Ingresos anuales no superan:
  * Manufactura: 23,563 UVT
  * Servicios: 32,988 UVT
  * Comercio: 44,769 UVT
- Consulta UVT vigente en DIAN`,
        
        intlTransfers: `Para giros del exterior:
- Recibe hasta $2,000 USD en oficinas
- Western Union como aliado
- Presenta código MTCN y documento
- Sin costo para cobro
- No aplica GMF (4x1000)`,
        
        insuranceDetails: `Nuestros seguros:
- Emitidos por compañías aseguradoras aliadas
- Solo seguro de vida deudor es obligatorio con créditos
- Otros seguros son voluntarios
- Reclamaciones directas con aseguradora
- Coberturas claras en póliza`,
        
        mobileBankingInfo: `Banca Móvil:
- Servicios informativos y transaccionales
- Registro presencial en oficina primero
- Sin costo de descarga o uso
- Consumo de datos aplica
- Funcionalidades completas 24/7`,
        
        thirdPartyAuth: `Para autorizar terceros:
- Poder general o especial notariado
- Presenta en oficina con documento
- Certificación de vigencia si es general
- Facultades claras para operaciones
- Tercero debe identificarse`,
        
        lostId: `Si perdiste tu cédula:
- Puedes realizar trámites con contraseña de registraduría
- Original y vigente
- Proceso de verificación adicional
- Renueva tu documento cuanto antes`,
        
        pseDetails: `PSE (Proveedor Servicios Electrónicos):
- Pago online seguro con fondos de ahorros
- Registro único en plataforma
- Transacciones en tiempo real
- Sin necesidad de tarjeta
- Amplia red de comercios afiliados`,
        
        default: `No entendí tu consulta. Puedes preguntarme sobre:
- Apertura de cuentas
- Tarjetas de crédito/débito
- Préstamos y créditos
- Ahorros e inversiones
- Banca digital
- Seguros
- Atención al cliente`
    };
    
    // Mapeo de palabras clave a respuestas
    const responseMap = [
        // General
        { keywords: ['hola', 'buenos días', 'buenas tardes', 'buenas noches'], response: 'greeting' },
        
        // Cuentas
        { keywords: ['abrir cuenta', 'requisitos cuenta', 'documentos cuenta'], response: 'openAccount' },
        { keywords: ['tipos cuenta', 'clases cuenta', 'cuenta ahorros', 'cuenta corriente', 'cuenta nómina'], response: 'accountTypes' },
        { keywords: ['costo cuenta', 'mantenimiento cuenta', 'tarifa cuenta'], response: 'accountCost' },
        { keywords: ['cerrar cuenta', 'cancelar cuenta'], response: 'closeAccount' },
        { keywords: ['cargos banco', 'comisiones cuenta', 'cómo evitar cargos'], response: 'bankCharges' },
        { keywords: ['saldo mínimo', 'balance mínimo', 'requisitos saldo'], response: 'minimumBalance' },
        { keywords: ['retirar todo', 'disponer ahorros', 'sin saldo mínimo'], response: 'savingsWithdrawal' },
        { keywords: ['oficinas nacionales', 'transacciones país', 'red oficinas'], response: 'nationalTransactions' },
        { keywords: ['documentos ahorros', 'requisitos ahorros', 'abrir cuenta ahorros'], response: 'savingsRequirements' },
        
        // Tarjetas
        { keywords: ['solicitar tarjeta crédito', 'pedir tarjeta', 'aplicar tarjeta'], response: 'creditCardApply' },
        { keywords: ['perdí tarjeta', 'extravié tarjeta', 'robo tarjeta'], response: 'cardLost' },
        { keywords: ['bloquear tarjeta', 'tarjeta robada', 'tarjeta pérdida'], response: 'cardBlock' },
        { keywords: ['aumentar límite', 'más crédito', 'incrementar tarjeta'], response: 'creditLimit' },
        { keywords: ['activar internacional', 'compras exterior', 'usar tarjeta fuera'], response: 'internationalCard' },
        { keywords: ['reposición tarjeta', 'costo reposición', 'tarjeta nueva'], response: 'cardReplacement' },
        { keywords: ['vencimiento tarjeta', 'cuándo vence', 'fecha expiración'], response: 'cardExpiration' },
        { keywords: ['compras internet', 'pagos online', 'compras web'], response: 'onlinePurchases' },
        { keywords: ['pagos sin contacto', 'contactless', 'ondas magnéticas'], response: 'contactlessSymbols' },
        { keywords: ['usar tarjeta extranjero', 'viajar con tarjeta', 'compras internacionales'], response: 'intlCardUse' },
        { keywords: ['notificar viaje', 'aviso salida país', 'viaje al exterior'], response: 'travelNotification' },
        { keywords: ['diferencia débito crédito', 'comparar tarjetas', 'cuál tarjeta'], response: 'debitVsCredit' },
        { keywords: ['robo tarjeta responsabilidad', 'qué hacer robo', 'tarjeta robada'], response: 'stolenCard' },
        { keywords: ['comisión pagar tarjeta', 'costo usar tarjeta', 'tarifa datáfono'], response: 'cardFees' },
        
        // Créditos
        { keywords: ['préstamo personal', 'documentos préstamo', 'requisitos crédito'], response: 'loanRequirements' },
        { keywords: ['tasa hipotecario', 'interés vivienda', 'crédito casa'], response: 'mortgageRate' },
        { keywords: ['crédito vehiculo', 'préstamo carro', 'financiación auto'], response: 'carLoan' },
        { keywords: ['refinanciar crédito', 'renegociar préstamo', 'unificar deudas'], response: 'refinance' },
        { keywords: ['microcrédito', 'financiación microempresa', 'crédito pequeño'], response: 'microcreditOptions' },
        { keywords: ['costos microcrédito', 'comisiones crédito', 'gastos préstamo'], response: 'microcreditCosts' },
        { keywords: ['garantía crédito', 'dejar de pagar', 'incumplimiento pago'], response: 'creditGuarantees' },
        { keywords: ['cancelación anticipada', 'pago adelantado', 'abonos extra'], response: 'earlyCancellation' },
        { keywords: ['documentos préstamo', 'papeles crédito', 'requisitos financiación'], response: 'loanDocuments' },
        { keywords: ['crédito negado', 'rechazo préstamo', 'no aprobaron'], response: 'deniedCredit' },
        { keywords: ['consejos pago', 'recomendaciones pagar', 'qué verificar pago'], response: 'paymentAdvice' },
        { keywords: ['unificar deudas', 'compra cartera', 'reestructurar créditos'], response: 'debtConsolidation' },
        { keywords: ['qué es microcrédito', 'definición microcrédito', 'microfinanciamiento'], response: 'microcreditDefinition' },
        { keywords: ['soy microempresa', 'tamaño negocio', 'clasificación empresa'], response: 'microBusiness' },
        
        // Ahorros e inversiones
        { keywords: ['opciones ahorro', 'dónde ahorrar', 'invertir dinero'], response: 'savingsOptions' },
        { keywords: ['cdt', 'certificado depósito', 'inversión a término'], response: 'cdtInfo' },
        { keywords: ['fondos inversión', 'inversión colectiva', 'fics'], response: 'investmentFunds' },
        { keywords: ['tasa interés', 'rendimiento cuenta', 'cuánto paga'], response: 'interestRates' },
        { keywords: ['recompensas cuenta', 'beneficios cuenta', 'ventajas cuenta'], response: 'accountRewards' },
        
        // Transferencias y pagos
        { keywords: ['4x1000', 'impuesto transacciones', 'gravamen financiero'], response: 'fourPerThousand' },
        { keywords: ['costos transferencia', 'tarifa enviar dinero', 'precio transacción'], response: 'transferFees' },
        { keywords: ['transferencia inmediata', 'envío rápido dinero', 'urgente transferencia'], response: 'instantTransfers' },
        { keywords: ['pago pse', 'botón pago', 'proveedor servicios electrónicos'], response: 'pseService' },
        { keywords: ['giros internacionales', 'recibir dinero exterior', 'cobrar giro'], response: 'intlTransfers' },
        
        // Banca digital
        { keywords: ['acceso en línea', 'entrar cuenta', 'banca internet'], response: 'onlineAccess' },
        { keywords: ['olvidé contraseña', 'recuperar acceso', 'resetear clave'], response: 'resetPassword' },
        { keywords: ['banca móvil', 'app banco', 'beneficios app'], response: 'mobileBanking' },
        { keywords: ['historial transacciones', 'extracto cuenta', 'movimientos recientes'], response: 'transactionHistory' },
        { keywords: ['pagos automáticos', 'débitos automáticos', 'programar pagos'], response: 'autoPayments' },
        { keywords: ['app móvil', 'banca móvil registro', 'descargar app'], response: 'mobileBankingInfo' },
        
        // Seguridad
        { keywords: ['movimientos no autorizados', 'cargos desconocidos', 'fraude cuenta'], response: 'unauthorizedCharge' },
        { keywords: ['correo sospechoso', 'phishing', 'correo falso'], response: 'suspiciousEmail' },
        { keywords: ['transacción no reconocida', 'no hice este pago', 'cargo desconocido'], response: 'unrecognizedTransactions' },
        { keywords: ['código verificación', 'autenticación dos factores', 'sms seguridad'], response: 'twoFactorAuth' },
        { keywords: ['celular perdido', 'robo móvil banca', 'hurto teléfono'], response: 'lostPhone' },
        
        // Empresas
        { keywords: ['cuenta empresarial', 'cuenta negocio', 'documentos empresa'], response: 'businessAccount' },
        { keywords: ['crédito empresa', 'préstamo negocio', 'financiación pyme'], response: 'businessLoan' },
        
        // Seguros
        { keywords: ['seguros banco', 'protección crédito', 'seguro vida', 'seguro hogar', 'seguro vehículo'], response: 'insuranceOptions' },
        { keywords: ['seguros obligatorios', 'pólizas banco', 'emitidos por banco'], response: 'insuranceDetails' },
        
        // Atención al cliente
        { keywords: ['presentar queja', 'reclamo banco', 'pqrs'], response: 'complaints' },
        { keywords: ['cuenta bloqueada', 'desbloquear cuenta', 'acceso suspendido'], response: 'blockedAccount' },
        { keywords: ['reclamar comisión', 'cobro injustificado', 'protestar tarifa'], response: 'feeComplaint' },
        { keywords: ['efectividad reclamación', 'qué hacer reclamación', 'banco españa'], response: 'complaintEffectiveness' },
        { keywords: ['canales atención', 'otros contactos', 'dónde quejarme'], response: 'additionalChannels' },
        
        // Otros temas
        { keywords: ['inclusión financiera', 'qué es inclusión', 'acceso financiero'], response: 'financialInclusion' },
        { keywords: ['transunion', 'centrales riesgo', 'reporte crédito'], response: 'transUnion' },
        { keywords: ['fallecido cuenta', 'herencia ahorros', 'titular fallecido'], response: 'deceasedAccount' },
        { keywords: ['fallecido deudor', 'muerte titular crédito', 'seguro deudor'], response: 'deceasedCredit' },
        { keywords: ['autorizar tercero', 'poder cuenta', 'otra persona operar'], response: 'thirdPartyAuth' },
        { keywords: ['cédula perdida', 'documento extraviado', 'hurto identificación'], response: 'lostId' },
        
        // Despedidas
        { keywords: ['adiós', 'adios', 'hasta luego', 'nos vemos', 'gracias'], response: 'farewell' }
    ];
    
    // Función para agregar un mensaje al chat
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;
        contentDiv.innerHTML = contentDiv.innerHTML.replace(/\n/g, '<br>');
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.append(contentDiv, timeDiv);
        elements.chatMessages.appendChild(messageDiv);
        
        elements.chatMessages.scrollTo({
            top: elements.chatMessages.scrollHeight,
            behavior: 'smooth'
        });
    }
    
    // Función para guardar la calificación
    function saveRating(rating) {
        const ratingData = {
            value: rating,
            date: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        state.ratings.push(ratingData);
        localStorage.setItem('chatbotRatings', JSON.stringify(state.ratings));
        
        console.log('Calificación guardada:', ratingData);
        console.log('Todas las calificaciones:', state.ratings);
    }
    
    // Función para mostrar estadísticas de calificación
    function showRatingStats() {
        if (state.ratings.length === 0) {
            console.log("No hay calificaciones aún");
            return;
        }
        
        const total = state.ratings.length;
        const sum = state.ratings.reduce((acc, curr) => acc + curr.value, 0);
        const average = sum / total;
        
        const distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
        state.ratings.forEach(r => distribution[r.value]++);
        
        console.log(`
        Estadísticas de Calificación:
        - Total calificaciones: ${total}
        - Promedio: ${average.toFixed(2)} estrellas
        - Distribución:
          5 estrellas: ${distribution[5]} (${(distribution[5]/total*100).toFixed(1)}%)
          4 estrellas: ${distribution[4]} (${(distribution[4]/total*100).toFixed(1)}%)
          3 estrellas: ${distribution[3]} (${(distribution[3]/total*100).toFixed(1)}%)
          2 estrellas: ${distribution[2]} (${(distribution[2]/total*100).toFixed(1)}%)
          1 estrella:  ${distribution[1]} (${(distribution[1]/total*100).toFixed(1)}%)
        `);
    }
    
    // Función para manejar las calificaciones
    function handleRating(ratingInput) {
        const rating = parseInt(ratingInput);
        
        if (rating >= 1 && rating <= 5) {
            saveRating(rating);
            addMessage(botResponses.ratingThanks(rating));
            state.isRating = false;
            showRatingStats(); // Mostrar estadísticas después de guardar
        } else {
            addMessage(botResponses.invalidRating);
        }
    }
    
    // Función para obtener respuesta del bot
    function getBotResponse(userMessage) {
        if (state.isRating) {
            handleRating(userMessage);
            return null;
        }
        
        const lowerCaseMessage = userMessage.toLowerCase().trim();
        
        // Detectar despedida para iniciar calificación
        if (/adiós|adios|hasta luego|nos vemos|gracias/i.test(lowerCaseMessage)) {
            state.isRating = true;
            return botResponses.farewell;
        }
        
        // Búsqueda normal de respuestas
        for (const item of responseMap) {
            if (item.keywords.some(keyword => 
                lowerCaseMessage.includes(keyword) || 
                keyword.split(' ').every(word => lowerCaseMessage.includes(word))
            )) {
                return botResponses[item.response];
            }
        }
        
        // Detección por patrones complejos
        if (/requisitos.*abrir.*cuenta|documentos.*cuenta/i.test(lowerCaseMessage)) {
            return botResponses.openAccount;
        }
        if (/tipos.*cuenta|clases.*cuenta/i.test(lowerCaseMessage)) {
            return botResponses.accountTypes;
        }
        if (/costo.*mantenimiento|tarifa.*cuenta/i.test(lowerCaseMessage)) {
            return botResponses.accountCost;
        }
        if (/solicitar.*tarjeta|pedir.*plástico/i.test(lowerCaseMessage)) {
            return botResponses.creditCardApply;
        }
        if (/aumentar.*límite|más.*crédito/i.test(lowerCaseMessage)) {
            return botResponses.creditLimit;
        }
        if (/préstamo.*personal|crédito.*consumo/i.test(lowerCaseMessage)) {
            return botResponses.loanRequirements;
        }
        if (/tasa.*hipoteca|interés.*vivienda/i.test(lowerCaseMessage)) {
            return botResponses.mortgageRate;
        }
        if (/cdt|certificado.*depósito/i.test(lowerCaseMessage)) {
            return botResponses.cdtInfo;
        }
        if (/4x1000|impuesto.*transacción/i.test(lowerCaseMessage)) {
            return botResponses.fourPerThousand;
        }
        if (/olvidé.*contraseña|recuperar.*clave/i.test(lowerCaseMessage)) {
            return botResponses.resetPassword;
        }
        if (/presentar.*queja|hacer.*reclamo/i.test(lowerCaseMessage)) {
            return botResponses.complaints;
        }
        
        return botResponses.default;
    }
    
    // Función para manejar el envío de mensajes
    function handleSendMessage() {
        const message = elements.userInput.value.trim();
        if (!message) return;
        
        addMessage(message, true);
        elements.userInput.value = '';
        
        // Mostrar "escribiendo..."
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'bot-message typing-indicator';
        typingIndicator.textContent = 'Escribiendo...';
        elements.chatMessages.appendChild(typingIndicator);
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
        
        setTimeout(() => {
            elements.chatMessages.removeChild(typingIndicator);
            const response = getBotResponse(message);
            if (response) {
                addMessage(response);
            }
        }, 800 + Math.random() * 700);
    }
    
    // Función para manejar preguntas rápidas
    function handleQuickQuestion(question) {
        elements.userInput.value = question;
        handleSendMessage();
    }
    
    // Función para simular reconocimiento de voz
    function handleVoiceCommand() {
        if (state.isListening) return;
        
        state.isListening = true;
        elements.micBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        addMessage("Escuchando...", true);
        
        const voiceCommands = [
            "¿Cuáles son los requisitos para abrir una cuenta?",
            "Quiero solicitar una tarjeta de crédito",
            "¿Cómo aumento el límite de mi tarjeta?",
            "Perdí mi tarjeta, ¿qué debo hacer?",
            "¿Cuál es la tasa para crédito de vivienda?",
            "Necesito información sobre CDT",
            "¿Cómo activo mi tarjeta para viajar?",
            "Recibí un correo sospechoso del banco",
            "Quiero presentar una queja formal",
            "¿Cómo funciona el 4x1000?",
            "¿Qué cargos aplica el banco?",
            "¿Cuál es el saldo mínimo requerido?",
            "¿Puedo usar un cajero automático gratis?",
            "¿Qué pasa si retiro más dinero del que tengo?",
            "¿Tienen las transferencias un costo?"
        ];
        
        setTimeout(() => {
            state.isListening = false;
            elements.micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            
            const randomCommand = voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
            addMessage(randomCommand, true);
            
            setTimeout(() => {
                const response = getBotResponse(randomCommand);
                addMessage(response);
            }, 800);
        }, 2000);
    }
    
    // Función para minimizar/maximizar el chat
    function toggleChatSize() {
        state.isMinimized = !state.isMinimized;
        
        if (state.isMinimized) {
            elements.chatbotWidget.classList.add('minimized');
            elements.minimizeBtn.innerHTML = '<i class="fas fa-plus"></i>';
        } else {
            elements.chatbotWidget.classList.remove('minimized');
            elements.minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
            setTimeout(() => {
                elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
            }, 100);
        }
    }
    
    // Inicialización del chatbot
    function initChatbot() {
        // Mensaje inicial con sugerencias
        setTimeout(() => {
            addMessage(botResponses.greeting);
            
            setTimeout(() => {
                addMessage(`Puedes preguntarme sobre:
- Apertura y manejo de cuentas
- Tarjetas de crédito y débito
- Préstamos personales e hipotecarios
- Inversiones (CDT, fondos)
- Banca digital y seguridad
- Quejas y reclamos
- Seguros y productos empresariales
- Transferencias y pagos
- Microcréditos y financiación`);
            }, 1000);
        }, 500);
        
        // Event listeners
        elements.sendBtn.addEventListener('click', handleSendMessage);
        elements.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
        
        elements.quickQuestions.forEach(button => {
            button.addEventListener('click', () => {
                handleQuickQuestion(button.getAttribute('data-question'));
            });
        });
        
        elements.micBtn.addEventListener('click', handleVoiceCommand);
        elements.minimizeBtn.addEventListener('click', toggleChatSize);
    }
    
    // Iniciar el chatbot
    initChatbot();
});