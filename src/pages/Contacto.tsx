import {
  Instagram,
  Mail,
  MapPin,
  ExternalLink,
  Clock,
  MessageCircle,
  FileUser,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";

export default function Contacto() {
  const googleFormUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSeDqofZ__fnivo1rzFrL7PsKCQcFVjrQuibPK-Cn7BU6XzOxw/viewform?usp=publish-editor";

  const whatsappNumber = "543586101467";
  const whatsappMessage = encodeURIComponent(
    "Hola! Quisiera hacer una consulta sobre sus productos.",
  );
  const rrhhEmail = "puestodecampoweb@gmail.com";

  const sedes = [
    {
      nombre: "Pedro Goyena 298",
      tipo: "Sucursal",
      link: "http://maps.google.com/?q=Pedro+Goyena+298+Rio+Cuarto",
    },
    {
      nombre: "Suipacha 304",
      tipo: "Sucursal",
      link: "http://maps.google.com/?q=Suipacha+304+Rio+Cuarto",
    },
    {
      nombre: "Gdor. Guzmán 1560",
      tipo: "Sucursal",
      link: "http://maps.google.com/?q=Gdor.+Guzman+1560+Rio+Cuarto",
    },
    {
      nombre: "Pte. Perón Este 1524",
      tipo: "Planta",
      link: "http://maps.google.com/?q=Pte.+Peron+Este+1524+Rio+Cuarto",
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 md:py-20 bg-card text-center border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
            <span className="text-primary">Contacto</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ¿Tenés alguna pregunta o querés hacer un pedido especial? Estamos
            acá para ayudarte.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          {/* Títulos de sección alineados */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-8 items-end">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Información de Contacto
            </h2>
            {/* Espacio vacío o subtítulo para mantener simetría en desktop */}
            <div className="hidden lg:block"></div>
          </div>

          {/* Grilla de Contenido alineada al tope */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* COLUMNA IZQUIERDA */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/puestodecampo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors group"
                >
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Instagram className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Instagram</h3>
                    <p className="text-sm text-muted-foreground">
                      @puestodecampo
                    </p>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:border-green-500/50 transition-colors group"
                >
                  <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">
                      +54 358 610-1467
                    </p>
                  </div>
                </a>
              </div>

              {/* Ubicaciones */}
              <div className="p-4 bg-card rounded-lg border border-border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">
                    Nuestras Sedes
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sedes.map((sede, index) => (
                    <a
                      key={index}
                      href={sede.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col p-3 bg-background/50 rounded-md border border-border/50 hover:border-primary/40 transition-all group/loc"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary/70">
                        {sede.tipo}
                      </span>
                      <span className="text-sm text-muted-foreground group-hover/loc:text-foreground truncate">
                        {sede.nombre}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Horarios */}
              <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-base">
                    Horarios de Atención
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Lun. a Sáb.: 8:30 - 13:30 / 17:30 - 21:30
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Dom.: 9:00 - 13:30
                  </p>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA - Ahora alineada al tope del Instagram */}
            <div className="space-y-6">
              {/* Card de RRHH */}
              <div className="p-6 md:p-8 bg-primary/5 rounded-2xl border-2 border-primary/20 relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <FileUser className="h-7 w-7 text-primary" />
                    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
                      ¿Querés trabajar con nosotros?
                    </h2>
                  </div>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    Estamos en constante crecimiento y buscamos talentos como
                    vos. Si te gustaría sumarte al equipo, envianos tu CV por
                    mail.
                  </p>
                  <a
                    href={`mailto:${rrhhEmail}?subject=Postulación Laboral - CV&body=Hola! Adjunto mi CV para futuras vacantes en Puesto de Campo.`}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95"
                  >
                    Enviar CV por Correo
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <FileUser
                  className="absolute -right-6 -bottom-6 opacity-[0.03] text-primary rotate-12 group-hover:rotate-0 transition-transform"
                  size={160}
                />
              </div>

              {/* Card de Formulario */}
              <div className="p-6 md:p-8 bg-card rounded-2xl border-2 border-dashed border-primary/30 text-center">
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
                  ¿Tenés otras dudas?
                </h2>
                <p className="text-muted-foreground text-sm mb-6 text-balance">
                  Completá nuestro formulario de consultas generales para
                  recibir una atención personalizada.
                </p>
                <a
                  href={googleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-foreground text-background font-bold rounded-xl hover:bg-foreground/90 transition-all shadow-xl active:scale-95"
                >
                  Abrir Formulario de Consultas
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
