import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const breadcrumbNameMap = {
    '': 'Home',
    'inventory': 'Inventory',
    'shopping-list': 'Shopping List',
    'reports': 'Reports'
  };

  return (
    <nav className="breadcrumb">
      <Link to="/" className="breadcrumb-item">
        🏠 Home
      </Link>
      {pathnames.length > 0 && <span className="breadcrumb-separator">/</span>}
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = breadcrumbNameMap[name] || name;

        return (
          <React.Fragment key={name}>
            {isLast ? (
              <span className="breadcrumb-item active">{displayName}</span>
            ) : (
              <>
                <Link to={routeTo} className="breadcrumb-item">
                  {displayName}
                </Link>
                <span className="breadcrumb-separator">/</span>
              </>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
