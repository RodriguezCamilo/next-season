import { setRequestLocale } from "next-intl/server";

type Props = {
    params: Promise<{ locale: "es" | "en" }>;
};

export const metadata = {
    title: "Terms of Service | SeasonTrack",
};

export default async function TermsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="mx-auto max-w-3xl px-4 py-12">
            <h1 className="mb-8 text-3xl font-bold">
                {locale === "en" ? "Terms of Service" : "Términos de Servicio"}
            </h1>

            <div className="prose prose-invert max-w-none">
                {locale === "en" ? (
                    <>
                        <p>Last updated: {new Date().toLocaleDateString()}</p>

                        <h2>1. Terms</h2>
                        <p>
                            By accessing this Website, accessible from https://seasontrack.app, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.
                        </p>

                        <h2>2. Use License</h2>
                        <p>
                            Permission is granted to temporarily download one copy of the materials on SeasonTrack's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul>
                            <li>modify or copy the materials;</li>
                            <li>use the materials for any commercial purpose or for any public display;</li>
                            <li>attempt to reverse engineer any software contained on SeasonTrack's Website;</li>
                            <li>remove any copyright or other proprietary notations from the materials; or</li>
                            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                        </ul>

                        <h2>3. Disclaimer</h2>
                        <p>
                            All the materials on SeasonTrack's Website are provided "as is". SeasonTrack makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, SeasonTrack does not make any representations concerning the accuracy or likely results of the use of the materials on its Website or otherwise relating to such materials or on any sites linked to this Website.
                        </p>

                        <h2>4. Limitations</h2>
                        <p>
                            SeasonTrack or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on SeasonTrack's Website, even if SeasonTrack or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.
                        </p>

                        <h2>5. Revisions and Errata</h2>
                        <p>
                            The materials appearing on SeasonTrack's Website may include technical, typographical, or photographic errors. SeasonTrack will not promise that any of the materials in this Website are accurate, complete, or current. SeasonTrack may change the materials contained on its Website at any time without notice. SeasonTrack does not make any commitment to update the materials.
                        </p>

                        <h2>6. Links</h2>
                        <p>
                            SeasonTrack has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by SeasonTrack of the site. The use of any linked website is at the user's own risk.
                        </p>
                    </>
                ) : (
                    <>
                        <p>Última actualización: {new Date().toLocaleDateString()}</p>

                        <h2>1. Términos</h2>
                        <p>
                            Al acceder a este sitio web, accesible desde https://seasontrack.app, usted acepta estar sujeto a estos Términos y Condiciones de Uso del sitio web y acepta que es responsable del acuerdo con las leyes locales aplicables. Si no está de acuerdo con alguno de estos términos, tiene prohibido el acceso a este sitio. Los materiales contenidos en este sitio web están protegidos por derechos de autor y leyes de marcas comerciales.
                        </p>

                        <h2>2. Licencia de Uso</h2>
                        <p>
                            Se concede permiso para descargar temporalmente una copia de los materiales en el sitio web de SeasonTrack solo para visualización transitoria personal y no comercial. Esta es la concesión de una licencia, no una transferencia de título, y bajo esta licencia usted no puede:
                        </p>
                        <ul>
                            <li>modificar o copiar los materiales;</li>
                            <li>usar los materiales para cualquier propósito comercial o para cualquier exhibición pública;</li>
                            <li>intentar aplicar ingeniería inversa a cualquier software contenido en el sitio web de SeasonTrack;</li>
                            <li>eliminar cualquier derecho de autor u otras notaciones de propiedad de los materiales; o</li>
                            <li>transferir los materiales a otra persona o "espejar" los materiales en cualquier otro servidor.</li>
                        </ul>

                        <h2>3. Descargo de responsabilidad</h2>
                        <p>
                            Todos los materiales en el sitio web de SeasonTrack se proporcionan "tal cual". SeasonTrack no ofrece garantías, ya sean expresas o implícitas, por lo que niega todas las demás garantías. Además, SeasonTrack no hace ninguna representación con respecto a la precisión o los resultados probables del uso de los materiales en su sitio web o de otra manera relacionados con dichos materiales o en cualquier sitio vinculado a este sitio web.
                        </p>

                        <h2>4. Limitaciones</h2>
                        <p>
                            SeasonTrack o sus proveedores no serán responsables de ningún daño que surja con el uso o la incapacidad de usar los materiales en el sitio web de SeasonTrack, incluso si SeasonTrack o un representante autorizado de este sitio web ha sido notificado, oralmente o por escrito, de la posibilidad de tal daño. Algunas jurisdicciones no permiten limitaciones en garantías implícitas o limitaciones de responsabilidad por daños incidentales, estas limitaciones pueden no aplicarse a usted.
                        </p>

                        <h2>5. Revisiones y Erratas</h2>
                        <p>
                            Los materiales que aparecen en el sitio web de SeasonTrack pueden incluir errores técnicos, tipográficos o fotográficos. SeasonTrack no promete que ninguno de los materiales en este sitio web sea preciso, completo o actual. SeasonTrack puede cambiar los materiales contenidos en su sitio web en cualquier momento sin previo aviso. SeasonTrack no se compromete a actualizar los materiales.
                        </p>

                        <h2>6. Enlaces</h2>
                        <p>
                            SeasonTrack no ha revisado todos los sitios vinculados a su sitio web y no es responsable de los contenidos de dicho sitio vinculado. La presencia de cualquier enlace no implica aprobación por parte de SeasonTrack del sitio. El uso de cualquier sitio web vinculado es bajo el propio riesgo del usuario.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
