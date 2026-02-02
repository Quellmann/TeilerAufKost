import React from "react";
import { Link } from "react-router-dom";

const Impressum = () => {
  const year = new Date().getFullYear();

  return (
    <div className="max-w-4xl mx-auto my-12 p-6 bg-light-card dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border">
      <div className="text-2xl font-bold mb-4">Impressum</div>

      <p className="mb-4">
        Diese Anwendung ist ein rein privates Projekt und wird nicht gewerblich
        betrieben. Sie dient ausschließlich zu Demonstrations- und
        Privatnutzungszwecken.
      </p>

      <section className="mb-4">
        <div className="font-semibold">Angaben gemäß § 5 DDG</div>
        <div className="mt-2 text-sm">
          TeilerAufKost
          <br />
          Betreiber: Sebastian Gleixner
          <br />
          Anschrift: Anni-Eisler-Lehmann-Str. 8a, Ap. 245, 55122 Mainz
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
        <ul className="list-disc list-inside mt-2 text-sm">
          <li>Die App ist ein nicht-kommerzielles, privates Projekt.</li>
          <li>
            Es besteht keine Pflicht zur Registrierung; personenbezogene Daten
            werden nur verarbeitet, wenn du sie uns freiwillig (z. B. per
            E‑Mail) mitteilst.
          </li>
        </ul>
      </section>

      <section className="mb-4">
        <div className="font-semibold">Streitbeilegung</div>
        <div className="mt-2 text-sm">
          Die EU‑Plattform zur Online‑Streitbeilegung ist unter{" "}
          <a
            className="underline"
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noreferrer"
          >
            https://ec.europa.eu/consumers/odr/
          </a>{" "}
          erreichbar. Wir sind nicht verpflichtet und nicht bereit, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </div>
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
