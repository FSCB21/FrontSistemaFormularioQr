import React, { useState }  from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Button } from 'primereact/button';
//icons
import { FaUserShield } from 'react-icons/fa'
import { ImExit } from 'react-icons/im'
import { useHistory } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import ConfigCredentials from './components/topBar/ConfigCredentials';

export const AppTopbar = (props) => {

    const history = new useHistory()

    const [ displayConfigCredentials, setDisplayConfigCredentials] = useState(false)

    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                <img src={'images/logo-principal.svg'} alt="logo"/>
                <span className='ml-2 text-lg'>by</span>
                <span>Fuxia</span>
            </Link>

            <Button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars"/>
            </Button>

            <Button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </Button>

            <ul className={classNames("layout-topbar-menu lg:flex origin-top", {'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
                <li>
                    <Button tooltip='Gestionar Contraseñas' tooltipOptions={{position:'top'}} className="p-link layout-topbar-button" onClick={() => setDisplayConfigCredentials(true)}>
                        <FaUserShield className='text-2xl mx-2'/>
                        <span>Gestionar Contraseñas</span>
                    </Button>
                </li>
                <li>
                    <Button tooltip='Salir' tooltipOptions={{position:'bottom'}} className="p-link layout-topbar-button"onClick={()=>history.push("/login")}>
                        <ImExit className='text-2xl mx-2'/>
                        <span>Salir</span>
                    </Button>
                </li>
            </ul>

            <Dialog header="Gestionar Contraseñas" visible={displayConfigCredentials} className="w-11 sm:w-8 md:w-6 xl:w-4" onHide={() => setDisplayConfigCredentials(false)}>
                <ConfigCredentials/>
            </Dialog>

        </div>
    );
}
