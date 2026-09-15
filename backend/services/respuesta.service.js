const REGLAS_RESPUESTA = {
  Informacion:
    'Hemos recopilado la información solicitada. Puedes consultarla en el detalle de tu solicitud.',
  Soporte:
    'Tu problema fue registrado y nuestro equipo de soporte lo revisará. Te notificaremos cuando esté resuelto.',
  Documento:
    'Tu solicitud de documento está en proceso y será emitido en los próximos días hábiles.',
  Consulta:
    'Respondemos tu consulta: el estado de tu proceso es el que se muestra en esta solicitud.',
  Actualizacion:
    'Tu solicitud de actualización fue recibida y será aplicada a la mayor brevedad.',
};

export function generarRespuesta(categoria) {
  return (
    REGLAS_RESPUESTA[categoria] ||
    'Hemos recibido tu solicitud y será atendida por nuestro equipo.'
  );
}