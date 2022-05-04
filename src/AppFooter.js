import React from 'react';

export const AppFooter = (props) => {

    return (
        <div className="layout-footer">
            <img src={'images/logo-principal.svg'} alt="Logo" height="20" className="mr-2" />
            by
            <span className="font-medium ml-2">Fuxia</span>
        </div>
    );
}
