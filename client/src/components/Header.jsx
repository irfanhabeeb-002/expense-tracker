export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand">
          <span className="header__logo" aria-hidden="true">
            ◈
          </span>
          <div>
            <h1 className="header__title">Expense Tracker</h1>
            <p className="header__subtitle">Track spending, stay on budget</p>
          </div>
        </div>
      </div>
    </header>
  );
}
