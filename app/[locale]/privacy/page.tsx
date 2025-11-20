import { setRequestLocale } from "next-intl/server";

type Props = {
    params: Promise<{ locale: "es" | "en" }>;
};

export const metadata = {
    title: "Privacy Policy | SeasonTrack",
};

export default async function PrivacyPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="mx-auto max-w-3xl px-4 py-12">
            <h1 className="mb-8 text-3xl font-bold">
                {locale === "en" ? "Privacy Policy" : "Política de Privacidad"}
            </h1>

            <div className="prose prose-invert max-w-none">
                {locale === "en" ? (
                    <>
                        <p>Last updated: {new Date().toLocaleDateString()}</p>
                        <p>
                            At SeasonTrack, accessible from https://seasontrack.app, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by SeasonTrack and how we use it.
                        </p>

                        <h2>Log Files</h2>
                        <p>
                            SeasonTrack follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
                        </p>

                        <h2>Cookies and Web Beacons</h2>
                        <p>
                            Like any other website, SeasonTrack uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
                        </p>

                        <h2>Google DoubleClick DART Cookie</h2>
                        <p>
                            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads">https://policies.google.com/technologies/ads</a>
                        </p>

                        <h2>Privacy Policies</h2>
                        <p>
                            You may consult this list to find the Privacy Policy for each of the advertising partners of SeasonTrack.
                        </p>
                        <p>
                            Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on SeasonTrack, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
                        </p>
                        <p>
                            Note that SeasonTrack has no access to or control over these cookies that are used by third-party advertisers.
                        </p>
                    </>
                ) : (
                    <>
                        <p>Última actualización: {new Date().toLocaleDateString()}</p>
                        <p>
                            En SeasonTrack, accesible desde https://seasontrack.app, una de nuestras principales prioridades es la privacidad de nuestros visitantes. Este documento de Política de Privacidad contiene tipos de información que es recopilada y registrada por SeasonTrack y cómo la usamos.
                        </p>

                        <h2>Archivos de Registro</h2>
                        <p>
                            SeasonTrack sigue un procedimiento estándar de uso de archivos de registro. Estos archivos registran a los visitantes cuando visitan sitios web. Todas las empresas de alojamiento hacen esto y es parte de los análisis de los servicios de alojamiento. La información recopilada por los archivos de registro incluye direcciones de protocolo de internet (IP), tipo de navegador, Proveedor de Servicios de Internet (ISP), fecha y hora, páginas de referencia/salida y posiblemente el número de clics. Estos no están vinculados a ninguna información que sea personalmente identificable. El propósito de la información es analizar tendencias, administrar el sitio, rastrear el movimiento de los usuarios en el sitio web y recopilar información demográfica.
                        </p>

                        <h2>Cookies y Web Beacons</h2>
                        <p>
                            Como cualquier otro sitio web, SeasonTrack utiliza "cookies". Estas cookies se utilizan para almacenar información, incluidas las preferencias de los visitantes y las páginas del sitio web a las que el visitante accedió o visitó. La información se utiliza para optimizar la experiencia de los usuarios personalizando el contenido de nuestra página web según el tipo de navegador de los visitantes y/u otra información.
                        </p>

                        <h2>Cookie DART de Google DoubleClick</h2>
                        <p>
                            Google es uno de los proveedores externos en nuestro sitio. También utiliza cookies, conocidas como cookies DART, para servir anuncios a los visitantes de nuestro sitio en función de su visita a www.website.com y otros sitios en internet. Sin embargo, los visitantes pueden optar por rechazar el uso de cookies DART visitando la Política de Privacidad de la red de contenido y anuncios de Google en la siguiente URL – <a href="https://policies.google.com/technologies/ads">https://policies.google.com/technologies/ads</a>
                        </p>

                        <h2>Políticas de Privacidad</h2>
                        <p>
                            Puede consultar esta lista para encontrar la Política de Privacidad de cada uno de los socios publicitarios de SeasonTrack.
                        </p>
                        <p>
                            Los servidores de anuncios de terceros o las redes publicitarias utilizan tecnologías como cookies, JavaScript o Web Beacons que se utilizan en sus respectivos anuncios y enlaces que aparecen en SeasonTrack, que se envían directamente al navegador de los usuarios. Reciben automáticamente su dirección IP cuando esto ocurre. Estas tecnologías se utilizan para medir la efectividad de sus campañas publicitarias y/o para personalizar el contenido publicitario que ve en los sitios web que visita.
                        </p>
                        <p>
                            Tenga en cuenta que SeasonTrack no tiene acceso ni control sobre estas cookies que utilizan los anunciantes de terceros.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
