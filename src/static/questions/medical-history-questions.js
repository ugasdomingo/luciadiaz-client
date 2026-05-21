export const medical_history_questions = [
    {
        title: 'Preguntas generales',
        questions: [
            { question: 'Nombre completo', type: 'text' },
            { question: 'Fecha de nacimiento', type: 'date' },
            { question: 'Contacto de emergencia (Ej.: +34 123 45 67 89)', type: 'tel' },
            { question: 'Documento de identificación', type: 'text' },
            { question: 'Nacionalidad', type: 'text' },
            { question: 'Dirección de residencia', type: 'text' },
            { question: 'Dirección de trabajo', type: 'text' },
            { question: 'Ocupación', type: 'text' },
            { question: 'Estado civil', type: 'text' },
            { question: '¿Quién le sugirió la consulta?', type: 'text' },
            { question: '¿Tiene seguro médico?', type: 'text' }
        ]
    },
    {
        title: 'Antecedentes médicos',
        questions: [
            { question: '¿Sufre alguna enfermedad actualmente? Indique cuál(es).', type: 'textarea' },
            { question: '¿Ha sufrido alguna enfermedad en el pasado? Indique cuál(es).', type: 'textarea' },
            { question: 'Indique las fechas de las enfermedades anteriores (si aplica)', type: 'textarea' },
            { question: '¿Se encuentra bajo tratamiento médico actualmente? Indique cuál(es).', type: 'textarea' },
            { question: 'Indique las dosis y frecuencia de los medicamentos (si aplica)', type: 'textarea' },
            { question: 'Nombre y teléfono del médico tratante (si aplica)', type: 'text' },
            { question: '¿Has estado en tratamiento psicológico o psiquiátrico? Indique cuál(es).', type: 'textarea' }
        ]
    },
    {
        title: 'Información matrimonial',
        questions: [
            { question: 'Nombre de la pareja', type: 'text' },
            { question: 'Edad de la pareja', type: 'text' },
            { question: 'Ocupación de la pareja', type: 'text' },
            { question: 'Grado de formación de la pareja', type: 'text' },
            { question: 'Tipo de relación (Matrimonio, Noviazgo, Convivencia)', type: 'text' },
            { question: 'Tiempo de relación', type: 'text' },
            { question: 'Matrimonios anteriores suyos (si aplica, indica fecha y edades de los hijos)', type: 'textarea' },
            { question: 'Matrimonios anteriores de la pareja (si aplica, indica fecha y edades de los hijos)', type: 'textarea' },
            { question: 'Del 1 al 10, tu grado de satisfacción con la comunicación con tu pareja', type: 'number' },
            { question: 'Del 1 al 10, tu grado de satisfacción con roles y responsabilidades en el hogar', type: 'number' },
            { question: 'Del 1 al 10, tu grado de satisfacción con manifestaciones afectivas de tu pareja', type: 'number' },
            { question: 'Del 1 al 10, tu grado de satisfacción con las relaciones sexuales', type: 'number' },
            { question: 'Del 1 al 10, tu grado de satisfacción con actividades sociales compartidas', type: 'number' },
            { question: 'Del 1 al 10, tu grado de satisfacción con recreación y tiempo libre', type: 'number' },
            { question: 'Del 1 al 10, tu grado de satisfacción con manejo de finanzas', type: 'number' },
            { question: 'Del 1 al 10, tu grado de satisfacción con métodos de crianza de los hijos', type: 'number' },
            { question: 'Del 1 al 10, tu grado de satisfacción con la relación con la familia política', type: 'number' }
        ]
    },
    {
        title: 'Información de los hijos',
        questions: [
            { question: '¿Tiene hijos?', type: 'text' },
            { question: 'Número de hijos', type: 'number' },
            { question: 'Edades de los hijos', type: 'text' },
            { question: 'Del 1 al 10, tu grado de satisfacción con la relación con cada uno de tus hijos', type: 'number' }
        ]
    },
    {
        title: 'Información de la familia',
        questions: [
            { question: 'Indica el nombre, parentesco y grado de satisfacción (del 1 al 10) con un miembro de tu familia', type: 'textarea' },
            { question: 'Indica el nombre, parentesco y grado de satisfacción (del 1 al 10) con un miembro de tu familia', type: 'textarea' },
            { question: 'Indica el nombre, parentesco y grado de satisfacción (del 1 al 10) con un miembro de tu familia', type: 'textarea' },
            { question: 'Indica el nombre, parentesco y grado de satisfacción (del 1 al 10) con un miembro de tu familia', type: 'textarea' },
            { question: 'Indica el nombre, parentesco y grado de satisfacción (del 1 al 10) con un miembro de tu familia', type: 'textarea' },
            { question: 'Si existen o han existido problemas mentales o emocionales en tu familia, por favor descríbalos.', type: 'textarea' },
            { question: '¿Cómo describiría el tipo de relaciones que predominan en tu familia? (familia unida, independiente, distante, conflictiva, etc.)', type: 'textarea' }
        ]
    },
    {
        title: 'Información religiosa',
        questions: [
            { question: '¿Pertenece a alguna religión?', type: 'text' },
            { question: 'Del 1 al 10, indique qué tan creyente es usted', type: 'number' },
            { question: 'Del 1 al 10, indique qué tan practicante es usted', type: 'number' }
        ]
    },
    {
        title: 'Ambiente social',
        questions: [
            { question: '¿Con quién vive actualmente? (indique nombre, edad y parentesco)', type: 'textarea' },
            { question: '¿Qué personas son importantes para usted? Incluya personas con quienes actualmente tiene alguna relación continua o permanente. No repita ninguno de los nombres que dio en la pregunta anterior. (indique nombre, edad y parentesco)', type: 'textarea' },
            { question: 'Del 1 al 10, ¿con qué frecuencia participa usted en actividades sociales? (reuniones con amigos, fiestas, paseos, etc.)', type: 'number' },
            { question: 'Del 1 al 10, ¿qué tan satisfecho está usted con sus actividades sociales?', type: 'number' }
        ]
    },
    {
        title: 'Información académica',
        questions: [
            { question: 'Describa en orden cronológico los colegios en los cuales ha estudiado', type: 'textarea' },
            { question: 'Describa en orden cronológico sus estudios universitarios', type: 'textarea' },
            { question: 'Del 1 al 10, ¿cómo es o fue, en general, su desempeño académico?', type: 'number' },
            { question: 'Del 1 al 10, ¿cuál es tu nivel de satisfacción con el estudio, si te encuentras estudiando actualmente?', type: 'number' }
        ]
    },
    {
        title: 'Información laboral',
        questions: [
            { question: '¿Estás trabajando actualmente?', type: 'text' },
            { question: '¿Cuál es tu ocupación actual?', type: 'text' },
            { question: 'Nombre de la empresa', type: 'text' },
            { question: 'Cargo', type: 'text' },
            { question: 'Describa con precisión lo que hace, incluyendo funciones específicas', type: 'textarea' },
            { question: '¿Cuál es tu horario de trabajo?', type: 'text' },
            { question: '¿Qué trabajos has desempeñado anteriormente? (indica nombre de la empresa, cargo, fecha y motivo de retiro)', type: 'textarea' },
            { question: 'Del 1 al 10, ¿cuál es tu grado de satisfacción en el desarrollo personal?', type: 'number' },
            { question: 'Del 1 al 10, ¿cuál es tu grado de satisfacción en la remuneración económica?', type: 'number' },
            { question: 'Del 1 al 10, ¿cuál es tu grado de satisfacción en las relaciones laborales?', type: 'number' },
            { question: 'Del 1 al 10, ¿cuál es tu grado de tensión o estrés por tu trabajo?', type: 'number' }
        ]
    },
    {
        title: 'Aficiones, intereses y recreación',
        questions: [
            { question: 'Escribe las actividades que haces actualmente en tu tiempo libre, incluye la frecuencia con la que las realizas (diario, semanal, mensual) y del 1 al 5 la satisfacción que te producen', type: 'textarea' },
            { question: 'Escribe las aficiones o intereses que tenías en el pasado y actualmente ya no tienes, incluye la frecuencia con la que las realizabas (diario, semanal, mensual) y del 1 al 5 la satisfacción que te producían', type: 'textarea' },
            { question: '¿Qué tipo de aficiones o actividades de recreación que no estás realizando en la actualidad te gustaría desarrollar en el futuro? Incluye la frecuencia con que las harías (diario, semanal, mensual) y del 1 al 5 la satisfacción que te producirían', type: 'textarea' },
            { question: 'Del 1 al 10, ¿cuál es tu nivel de satisfacción actual en tus aficiones, intereses y recreación?', type: 'number' }
        ]
    },
    {
        title: 'Autodescripción',
        questions: [
            { question: 'Describe tu aspecto físico. ¿Cómo es usted?', type: 'textarea' },
            { question: '¿Cuáles son tus preferencias? ¿Qué te gusta? ¿Qué cosas, personas, situaciones o actividades te producen agrado o placer?', type: 'textarea' },
            { question: '¿Qué cosas, personas, situaciones o actividades específicas te producen nervios, incomodidad, tensión o tristeza?', type: 'textarea' },
            { question: '¿Qué tipo de reacciones tiene usted cuando está de mal genio? ¿Qué cosas hace?', type: 'textarea' },
            { question: '¿Qué tipo de reacciones tiene usted cuando está nerviosa(o) o tensa(o)?', type: 'textarea' },
            { question: 'Generalmente, ¿qué hace y cómo reacciona cuando está triste?', type: 'textarea' },
            { question: '¿Cuáles son tus cualidades personales? ¿Qué diría una persona que le conoce bien si le preguntan cuáles son sus puntos positivos? Por favor, sea específica(o).', type: 'textarea' },
            { question: '¿Cuáles son tus limitaciones personales? ¿Qué diría una persona que le conoce bien si le preguntan cuáles son sus principales defectos? Por favor, sea específica(o).', type: 'textarea' }
        ]
    },
    {
        title: 'Motivo de consulta',
        questions: [
            { question: 'Por favor, describe las principales razones, problemas o quejas por los cuales ha decidido buscar asesoría psicológica.', type: 'textarea' },
            { question: '¿Desde cuándo has tenido estas dificultades?', type: 'textarea' },
            { question: '¿A qué cree que se deben estos problemas?', type: 'textarea' },
            { question: '¿Qué personas, situaciones o actividades parecen producir o empeorar estas dificultades?', type: 'textarea' },
            { question: '¿Qué personas, situaciones o actividades parecen ayudar o mejorar estas dificultades?', type: 'textarea' },
            { question: '¿A quién le ha pedido consejo respecto a estos problemas? ¿Cuándo y con qué resultados?', type: 'textarea' }
        ]
    },
    {
        title: 'Otras áreas de ajuste',
        questions: [
            { question: '¿Tiene o ha tenido dificultades para hacerse respetar y para hacer valer sus derechos, expresar desacuerdo o resentimiento cuando es apropiado, o impedir que otras personas se aprovechen de usted? Por favor, explique.', type: 'textarea' },
            { question: '¿Tiene o ha tenido períodos de profunda tristeza o depresión en los que no siente ánimo para desempeñar ninguna actividad? Por favor, explique.', type: 'textarea' },
            { question: '¿Ha tenido o tiene actualmente dificultades de tipo sexual?', type: 'textarea' },
            { question: '¿Tiene o ha tenido alguna dificultad en establecer o mantener relaciones satisfactorias de amistad con otras personas? Por favor, explique detalladamente', type: 'textarea' },
            { question: '¿Tiene o ha tenido alguna dificultad para establecer relaciones afectivas con otras personas? Por favor, explique', type: 'textarea' },
            { question: '¿Tiene o ha tenido algún tipo de temor muy intenso ante alguna situación u objeto que interfiera con su actividad normal?', type: 'textarea' },
            { question: '¿Tiene dolores de cabeza con frecuencia?', type: 'textarea' },
            { question: '¿Tiene o ha tenido problemas para controlar su consumo de bebidas alcohólicas? Por favor, explique.', type: 'textarea' },
            { question: '¿Ha probado alguna vez marihuana, cocaína, drogas heroicas u otras sustancias no prescritas médicamente? Por favor, explique.', type: 'textarea' },
            { question: '¿Qué espera obtener del presente tratamiento psicológico?', type: 'textarea' },
            { question: '¿Qué otra información que no haya estado incluida en el presente cuestionario considera que podría ser útil para el tratamiento?', type: 'textarea' }
        ]
    }
];
