import {
  ChevronDoubleDownIcon,
  UserGroupIcon,
  QrCodeIcon,
  CheckIcon,
  PlusIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

import LandingPageJoinGroup from "../components/LandingPageJoinGroup";
import LandingPageAddExpanse from "../components/LandingPageAddExpanse";
import LandingPageOverview from "../components/LandingPageOverview";
import LandingPageNewGroup from "../components/LandingPageNewGroup";

const LandingPage = () => {
  const scrollToHow = () => {
    const el = document.getElementById("how-it-works");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  const year = new Date().getFullYear();
  const [joinOption, setJoinOption] = useState(0);

  return (
    <div className="mt-10 text-center">
      <div className="text-3xl font-bold">
        Kostenaufteilung war noch nie einfacher.
      </div>
      <div className="mt-5 font-thin">
        Organisiere Ausgaben, berechne automatische Rückzahlungen und behalte
        die Übersicht über Geldflüsse.
      </div>
      <div className="mt-5 flex flex-col items-center">
        <div
          onClick={scrollToHow}
          className="cursor-pointer w-4/5 py-1 px-4 mx-auto border border-light-border dark:border-dark-border rounded-full bg-light-card dark:bg-dark-card"
        >
          Erfahre wie es funktioniert und starte jetzt, komplett kostenlos!
        </div>
        <div>
          <ChevronDoubleDownIcon className="cursor-pointer w-6 h-6 mt-2 mx-auto" />
        </div>
      </div>

      <div className="mt-5 flex">
        <div className="w-[80%] mx-auto">
          <img
            src="/heropage/hero-groupoverview-light.png"
            className="object-fill rounded-lg dark:hidden rotate-3 shadow-2xl shadow-gray-500 mx-auto"
          />
          <img
            src="/heropage/hero-groupoverview-dark.png"
            className="object-cover rounded-lg hidden dark:block rotate-3 shadow-2xl shadow-blue-500 mx-auto"
          />
        </div>
      </div>
      {/* Feature hero */}
      <div className="mt-20">
        <div className="max-w-3xl mx-auto p-6 bg-light-card dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-xl font-bold">
                Behalte den Überblick, ohne manuelles Rechnen
              </div>
              <div className="mt-5 text-sm text-muted">
                TeilerAufKost hilft dir, Ausgaben und Transaktionen, die für
                dich und deine Gruppe anfallen, einfach zu verwalten. Perfekt,
                um gemeinsam Rechnungen zu begleichen und Kosten untereinander
                gerecht aufzuteilen.
              </div>
            </div>
          </div>
          <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <li className="flex items-center gap-2">
              <CheckIcon className="min-w-5 h-5 mt-1 text-green-500" />
              <span className="text-sm">
                Automatische Abrechnungen geteilter Kosten
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="min-w-5 h-5 mt-1 text-green-500" />
              <span className="text-sm">Übersicht aller Geldbewegungen</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="min-w-5 h-5 mt-1 text-green-500" />
              <span className="text-sm">Statistiken und Visualisierung</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="min-w-5 h-5 mt-1 text-green-500" />
              <span className="text-sm">
                Berechnung pro Mitglied oder pro Haushalt
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="min-w-5 h-5 mt-1 text-green-500" />
              <span className="text-sm">Ohne Anmeldung oder Registrierung</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="min-w-5 h-5 mt-1 text-green-500" />
              <span className="text-sm">
                Einfache Einladungen per QR-Code oder Link
              </span>
            </li>
          </ul>
        </div>
      </div>
      {/* Schritt 1 & 2 */}
      <div>
        <div id="how-it-works" className="mt-10">
          <div className="text-2xl font-bold mb-4">So funktioniert's:</div>
          <div className="text-sm mb-6 text-muted">
            Entscheide dich für eine der Optionen
          </div>
          <div className="flex justify-around mt-10 gap-2">
            <div
              onClick={() => {
                setJoinOption(0);
              }}
              className={
                "flex justify-center w-full px-2 pb-5 relative cursor-pointer border border-light-border dark:border-dark-border rounded-3xl bg-light-card dark:bg-dark-card" +
                (joinOption === 0
                  ? " ring ring-gray-500 dark:ring-blue-500"
                  : "")
              }
            >
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-2 border w-16 border-light-border dark:border-dark-border rounded-full bg-light-card dark:bg-dark-card">
                1
              </div>
              <div className="mt-10 p-1">
                <UserGroupIcon className="w-10 h-10 mx-auto mb-2"></UserGroupIcon>
                <div className="text-lg">Erstelle eine neue Gruppe</div>
                <div className="mt-6 font-thin text-sm">
                  Lege eine neue Gruppe für deinen Haushalt oder Ausflug an.
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                setJoinOption(1);
              }}
              className={
                "flex justify-center w-full px-2 pb-5 relative cursor-pointer border border-light-border dark:border-dark-border rounded-3xl bg-light-card dark:bg-dark-card" +
                (joinOption === 1
                  ? " ring ring-gray-500 dark:ring-blue-500"
                  : "")
              }
            >
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-2 border w-16 border-light-border dark:border-dark-border rounded-full bg-light-card dark:bg-dark-card">
                2
              </div>
              <div className="mt-10 p-1">
                <QrCodeIcon className="w-10 h-10 mx-auto mb-2"></QrCodeIcon>
                <div className="text-lg">Trete einer Gruppe bei</div>
                <div className="mt-6 font-thin text-sm">
                  Falls bereits eine Gruppe erstellt wurde, kannst du ihr ganz
                  einfach beitreten
                </div>
              </div>
            </div>
          </div>
          {joinOption === 0 ? (
            <LandingPageNewGroup></LandingPageNewGroup>
          ) : (
            <LandingPageJoinGroup></LandingPageJoinGroup>
          )}
          {/* Schritt 3 */}
          <div className="mt-28">
            <div
              className={
                "flex justify-center w-full mx-auto px-2 pb-5 relative border border-light-border dark:border-dark-border rounded-3xl bg-light-card dark:bg-dark-card"
              }
            >
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-2 border w-16 border-light-border dark:border-dark-border rounded-full bg-light-card dark:bg-dark-card">
                3
              </div>
              <div className="mt-10 p-1">
                <PlusIcon className="w-10 h-10 mx-auto mb-2"></PlusIcon>
                <div className="text-lg">Füge neue Ausgaben hinzu</div>
                <div className="mt-6 font-thin text-sm">
                  Verbuche deine Ausgaben oder Transaktionen mithilfe der App
                </div>
              </div>
            </div>
            <LandingPageAddExpanse
              joinOption={joinOption}
            ></LandingPageAddExpanse>
          </div>
          {/* Schritt 4 */}
          <div className="mt-28">
            <div
              className={
                "flex justify-center w-full mx-auto px-2 pb-5 relative border border-light-border dark:border-dark-border rounded-3xl bg-light-card dark:bg-dark-card"
              }
            >
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-2 border w-16 border-light-border dark:border-dark-border rounded-full bg-light-card dark:bg-dark-card">
                4
              </div>
              <div className="mt-10 p-1">
                <PresentationChartLineIcon className="w-10 h-10 mx-auto mb-2"></PresentationChartLineIcon>
                {/* <DocumentMagnifyingGlassIcon className="w-10 h-10 mx-auto mb-2"></DocumentMagnifyingGlassIcon> */}
                <div className="text-lg">Behalte alles im Blick</div>
                <div className="mt-6 font-thin text-sm">
                  Behalte den Überblick über deinen Saldo, deine
                  Ausgleichszahlungen, bezahlte und verbrauchte Geldmengen,
                  zeitliche Verläufe und mehr.
                </div>
              </div>
            </div>
            <LandingPageOverview joinOption={joinOption}></LandingPageOverview>
          </div>
        </div>
      </div>

      {/* CTA - Call to action */}
      <div className="mt-28 p-6 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-between gap-4">
          <div className="text-left">
            <div className="text-2xl font-bold text-center">
              Bereit, gemeinsame Ausgaben zu vereinfachen?
            </div>
            <div className="mt-2 text-sm text-center">
              Starte jetzt direkt, erstelle eine Gruppe und lade Freunde per
              QR‑Code oder Link ein.
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href="/newGroup"
              className="px-6 py-3 rounded-xl border border-light-border dark:border-dark-border ring ring-gray-500 dark:ring-blue-500"
            >
              Jetzt Gruppe erstellen
            </a>
          </div>
        </div>
        <div className="mt-3 text-xs text-muted text-center">
          Kostenlos • Kein Login erforderlich • Unbegrenzt nutzbar • Ohne
          Werbung
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-light-border dark:border-dark-border">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-muted">© {year} TeilerAufKost</span>
            <span className="font-thin">by Sebastian Gleixner</span>
          </div>
          <span className="text-muted">Made with ❤️</span>
          <a href="/imprint" className="hover:underline">
            Impressum
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
