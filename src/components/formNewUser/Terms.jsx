import React from 'react'

import { Accordion, AccordionTab } from 'primereact/accordion';

const Terms = () => {
  return (
    <div>
        <Accordion className="accordion-custom" activeIndex={0}>
                <AccordionTab header={<React.Fragment><i className="pi pi-phone"></i><span className='text-xs'> Envío De Mensajes</span></React.Fragment>}>
                    <p className='text-xs'>
                        Al enviar el siguiente formulario acepta que FXA envie mensajes via sms informando de promociones, descuentos y otra información que será suministrada unica y exclusivamente por FXA.
                    </p>
                </AccordionTab>
                <AccordionTab header={<React.Fragment><i className="pi pi-copy"></i><span className='text-xs'> Uso De La Información Personal</span></React.Fragment>}>
                    <p className='text-xs'>
                        Cuando nos proporcione su información personal, nosotros la utilizaremos para el propósito específico para el que fue obtenida, entre otros para fines comerciales y estadísticos.
                    </p>
                </AccordionTab>
                <AccordionTab header={<React.Fragment><i className="pi pi-user"></i><span className='text-xs'> Información De Los Usuarios</span></React.Fragment>}>
                    <p className='text-xs'>
                        También podremos utilizar su información personal por conducto de los responsables de la página de Internet o de la promoción, así como por nuestras otras marcas, para contactarlo respecto de otros productos que podrían serle de interés  Sin embargo, en cualquier momento podrá optar por dejar de proporcionar esta información. En ocasiones podremos contactar a terceras personas para administrar o analizar la información que obtengamos, incluyendo información personal, con la finalidad de ayudarnos a mejorar nuestros productos y nuestros aplicaciones de Internet.
                    </p>
                </AccordionTab>
                <AccordionTab header={<React.Fragment><i className="pi pi-database"></i><span className='text-xs'> Almacenamiento De La Información</span></React.Fragment>}>
                    <p className='text-xs'>
                        Al participar autoriza y otorga el consentimiento expresamente a que FXA registre en un archivo informático sus datos personales con el fin de atender sus solicitudes, y que de la misma forma realice tratamiento estadístico de los mismos referente a investigación del consumidor y divulgación de información sobre los productos de la compañía, así como a que se le mantenga informado de actividades comerciales y publicitarias. Esta comunicación podrá efectuarse desde el mismo momento en que facilita sus datos. Así mismo con su aceptación FXA se comprometerá a cuidar la confidencialidad y privacidad de sus datos, a no cederlos, ni venderlos, ni permitir el acceso por parte de terceros sin previa autorización y objetivo de consulta estadística precisa.  Todos los datos son tratados con base en la Ley de Habeas data.
                    </p>
                </AccordionTab>
                <AccordionTab header={<React.Fragment><i className="pi pi-shield"></i><span className='text-xs'> Seguridad Del Dispositivo</span></React.Fragment>}>
                    <p className='text-xs'>
                        FXA no asume responsabilidad, y/o no será sujeto a reclamos por daños de cualquier tipo como por ejemplo un virus que pueda infectar su computador, dispositivo móvil u otra propiedad debido al acceso, uso de, o visita a este sitio Web, la transferencia de datos, materiales, texto, imágenes, videos o sonidos del sitio Web a su CPU, módem, disco duro o almacenamiento de su dispositivo móvil.
                    </p>
                </AccordionTab>
                <AccordionTab header={<React.Fragment><i className="pi pi-credit-card"></i><span className='text-xs'> Datos De Cobro</span></React.Fragment>}>
                    <p className='text-xs'>
                        FXA no solicitará a través del presente formulario, información de tipo financiero o bancario como número de cuenta bancaria, tarjeta de crédito, clave personal, etc.
                    </p>
                </AccordionTab>
                <AccordionTab header={<React.Fragment><i className="pi pi-times-circle"></i><span className='text-xs'> Identidad Del Usuario</span></React.Fragment>}>
                    <p className='text-xs'>
                        Se prohíbe usar el sitio indebidamente, falsear la identidad de un usuario y llevar a cabo actividades fraudulentas en el sitio web.
                    </p>
                </AccordionTab>
                <AccordionTab header={<React.Fragment><i className="pi pi-book"></i><span className='text-xs'> Sobre Habeas Data</span></React.Fragment>}>
                    <p className='text-xs'>
                        Estas políticas de privacidad y en general textos de la página,  serán gobernados e interpretados de acuerdo con las leyes de la República de Colombia en cumplimiento de la ley de Habeas Data y Decretos reglamentarios.
                    </p>
                </AccordionTab>
                <AccordionTab header={<React.Fragment><i className="pi pi-search"></i><span className='text-xs'> Términos Y Condiciones De Uso</span></React.Fragment>}>
                    <p className='text-xs'>
                        Al acceder, hojear y/o usar este Sitio Web, el usuario admite haber leído y entendido estos Términos de Uso y estar de acuerdo en sujetarse a los mismos y cumplir con todas las leyes y reglamentos aplicables que hagan parte de la Legislación Colombiana. Además, cuando el usuario utilice cualquier servicio suministrado en este Sitio Web, estará sujeto a las reglas, guías, políticas, términos y condiciones aplicables a dicho servicio en particular. FXA  no se responsabiliza de que el material en este Sitio Web sea apropiado o esté disponible para su uso en otros lugares, estando prohibido su acceso desde territorios donde su contenido sea ilegal. Aquellos que decidan acceder a este Sitio Web desde otros lugares lo harán bajo su propia iniciativa y es su responsabilidad el sujetarse a las leyes locales que sean aplicables. En caso de que el usuario no esté de acuerdo con estos términos, favor abstenerse de usar este Sitio Web. Cualquier reclamo con relación a este Sitio Web y el material en él contenido está regulado por las leyes de Colombia. Estos términos y condiciones están sujetos a cambios sin previo aviso en cualquier momento, bajo el principio de autonomía de la voluntad de FXA  y a partir de la fecha de modificación de estos términos y condiciones, todas las operaciones que se celebren entre FXA  y el usuario se regirán por el documento modificado, lo cual acepta desde ya el Usuario y/o Cliente.
                    </p>
                </AccordionTab>
            </Accordion>
    </div>
  )
}

export default Terms