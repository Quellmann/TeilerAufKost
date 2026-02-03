import { Link } from "react-router-dom";

const Impressum = () => {
  const year = new Date().getFullYear();

  return (
    <div className="max-w-4xl mx-auto my-3 p-6 bg-light-card dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border">
      <div className="text-2xl font-bold mb-4">Impressum</div>

      <p className="mb-4">
        Diese Anwendung ist ein rein privates Projekt und wird nicht gewerblich
        betrieben. Sie dient ausschließlich zu Demonstrations- und
        Privatnutzungszwecken.
      </p>

      <section className="mb-4">
        <div className="mt-2">
          <div className="text-lg font-semibold">TeilerAufKost</div>
          <div className="mt-2">
            Betreiber: <span>Sebastian Gleixner</span>
          </div>
          <div className="">
            Kontakt: <span>sebastian.gleixner.stud@gmail.com</span>
          </div>
        </div>
      </section>

      <section className="mb-4">
        <div className="text-lg font-semibold">Hinweis zur Nutzung</div>
        <ul className="list-disc list-outside mt-2 text-sm pl-3">
          <li>Die App ist ein nicht-kommerzielles, privates Projekt.</li>
          <li>
            Alle eingepflegten Informationen werden unverschlüsselt auf der
            Datenbank gespeichert und können durch den Betreiber eingesehen
            werden.
          </li>
          <li>
            Bei Benutzung der App sollten keine sensiblen Daten verwendet und
            innerhalb einer Gruppe abgespeichert werden.
          </li>
          <li>
            Durch die Verwendung der App stimmst du der Verarbeitung und
            Speicherung deiner eingepflegten Informationen zu.
          </li>
        </ul>
      </section>

      <div className="text-sm text-muted">
        © {year} TeilerAufKost - Ein privates Projekt.
      </div>

      <div className="mt-6">
        <Link to="/" className="text-sm underline">
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
};

export default Impressum;
