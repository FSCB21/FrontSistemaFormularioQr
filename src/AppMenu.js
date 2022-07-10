/* Archivo de la plantilla que contiene la configuracion del menu lateral derecho */

//Importamos el componente de react y su gancho de use state
import React, { useState } from 'react';

//Importamos el componente de navlink para realizar la redireccion
import { NavLink } from 'react-router-dom';

//Importamos las animaciones
import { CSSTransition } from 'react-transition-group';

//Importamos el metodo de classnames para el manejo de clases
import classNames from 'classnames';

//Importamos componentes de estilo de primereact
import { Ripple } from "primereact/ripple";
import { Badge } from 'primereact/badge';

//Declaramos la funcion de retorno del componente
const AppSubmenu = (props) => {

    //Definimos los ganchos de estado
    const [activeIndex, setActiveIndex] = useState(null)

    /**
     * Funcion que ejecutara la redirecccion de la pagina segun el item al cual se le da click
     * 
     * Para esto se le pasa en los parametros el elemento y sus atributos
     */
    const onMenuItemClick = (event, item, index) => {
        //avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        //execute command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
        }

        if (index === activeIndex)
            setActiveIndex(null);
        else
            setActiveIndex(index);

        if (props.onMenuItemClick) {
            props.onMenuItemClick({
                originalEvent: event,
                item: item
            });
        }
    }

    //Metodo que va a detectar el momento en el cual se preccione una tecla del teclado
    //Pero en este caso del menu, asi que dicce que en el momento de dar enter en el item se reslice la redireccion 
    const onKeyDown = (event) => {
        if (event.code === 'Enter' || event.code === 'Space') {
            event.preventDefault();
            event.target.click();
        }
    }

    //Funciones que renderizan el contenido del menu para cada elemento
    //Recibe el elemento y lo renderiza con su respectivo estilado
    const renderLinkContent = (item) => {
        let submenuIcon = item.items && <i className="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>;
        let badge = item.badge && <Badge value={item.badge} />

        return (
            <React.Fragment>
                <i className={item.icon}></i>
                <span>{item.label}</span>
                {submenuIcon}
                {badge}
                <Ripple />
            </React.Fragment>
        );
    }
    const renderLink = (item, i) => {
        let content = renderLinkContent(item);

        if (item.to) {
            return (
                <NavLink aria-label={item.label} onKeyDown={onKeyDown} role="menuitem" className="p-ripple" activeClassName="router-link-active router-link-exact-active" to={item.to} onClick={(e) => onMenuItemClick(e, item, i)} exact target={item.target}>
                    {content}
                </NavLink>
            )
        }
        else {
            return (
                <a tabIndex="0" aria-label={item.label} onKeyDown={onKeyDown} role="menuitem" href={item.url} className="p-ripple" onClick={(e) => onMenuItemClick(e, item, i)} target={item.target}>
                    {content}
                </a>
            );
        }
    }

    //Se define una varaible que contendra el mapeo de los items para dw esta manera darle la estructura de menu
    let items = props.items && props.items.map((item, i) => {
        let active = activeIndex === i;
        let styleClass = classNames(item.badgeStyleClass, { 'layout-menuitem-category': props.root, 'active-menuitem': active && !item.to });

        if (props.root) {
            return (
                <li className={styleClass} key={i} role="none">
                    {props.root === true && <React.Fragment>
                        <div className="layout-menuitem-root-text" aria-label={item.label}>{item.label}</div>
                        <AppSubmenu items={item.items} onMenuItemClick={props.onMenuItemClick} />
                    </React.Fragment>}
                </li>
            );
        }
        else {
            return (
                <li className={styleClass} key={i} role="none">
                    {renderLink(item, i)}
                    <CSSTransition classNames="layout-submenu-wrapper" timeout={{ enter: 1000, exit: 450 }} in={active} unmountOnExit>
                        <AppSubmenu items={item.items} onMenuItemClick={props.onMenuItemClick} />
                    </CSSTransition>
                </li>
            );
        }
    });

    return items ? <ul className={props.className} role="menu">{items}</ul> : null;
}

//Exportamos el componente donde se va a renderizar el menu con los items que se pasan como parametros
export const AppMenu = (props) => {

    return (
        <div className="layout-menu-container">
            <AppSubmenu items={props.model} className="layout-menu" onMenuItemClick={props.onMenuItemClick} root={true} role="menu" />
        </div>
    );
}
