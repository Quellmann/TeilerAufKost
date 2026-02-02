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
        <div className="mt-2 font-semibold">
          TeilerAufKost
          <br />
          Betreiber: <span className="font-normal">Sebastian Gleixner</span>
          <br />
          Anschrift:
          <span className="font-normal">
            {" "}
            Anni-Eisler-Lehmann-Str. 8a, Ap. 245, 55122 Mainz
          </span>
        </div>
      </section>

      <section className="mb-4">
        <div className="font-semibold">Kontakt</div>
        <div className="mt-2 text-sm">
          E-Mail:{" "}
          <a className="underline" href="sebastian.gleixner.stud@gmail.com">
            sebastian.gleixner.stud@gmail.com
          </a>
        </div>
      </section>

      <section className="mb-4">
        <div className="font-semibold">Hinweis zur Nutzung</div>
        <ul className="list-disc list-outside mt-2 text-sm pl-3">
          <li>Die App ist ein nicht-kommerzielles, privates Projekt.</li>
          <li>
            Alle eingepflegten Informationen werden unverschlüsselt auf der
            Datenbank gespeichert und können durch den Betreiber eingesehen
            werden. Bei Benutzung der App sollten daher keine sensible Daten
            verwendet werden.
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
