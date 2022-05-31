import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import classNames from 'classnames';
import {Button} from "primereact/button";
import { Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';
export const AppConfig = (props) => {

    const [cookies, setCookie] = useCookies(['scaleCookie','themeCookie']);

    const [active, setActive] = useState(false);
    const [scale, setScale] = useState(cookies.scaleCookie?parseInt(cookies.scaleCookie):14);
    const [scales] = useState([11,12,13,14,15,16,17]);
    const [theme, setTheme] = useState(cookies.themeCookie?cookies.themeCookie:'lara-light-indigo');
    const config = useRef(null);
    let outsideClickListener = useRef(null);

    const unbindOutsideClickListener = useCallback(() => {
        if (outsideClickListener.current) {
            document.removeEventListener('click', outsideClickListener.current);
            outsideClickListener.current = null;
        }
    }, []);

    const hideConfigurator = useCallback((event) => {
        setActive(false);
        unbindOutsideClickListener();
        event.preventDefault();
    }, [unbindOutsideClickListener]);

    const bindOutsideClickListener = useCallback(() => {
        if (!outsideClickListener.current) {
            outsideClickListener.current = (event) => {
                if (active && isOutsideClicked(event)) {
                    hideConfigurator(event);
                }
            };
            document.addEventListener('click', outsideClickListener.current);
        }
    }, [active, hideConfigurator]);

    useEffect(() => {
        if (active) {
            bindOutsideClickListener()
        }
        else {
            unbindOutsideClickListener()
        }
    }, [active, bindOutsideClickListener, unbindOutsideClickListener]);

    const isOutsideClicked = (event) => {
        return !(config.current.isSameNode(event.target) || config.current.contains(event.target));
    }

    const decrementScale = () => {
        let i = (prevState) => --prevState
        setCookie('scaleCookie', i(scale), {path: '/'})
        setScale((prevState) => --prevState);
    }

    const incrementScale = () => {
        let i = (prevState) => ++prevState
        setCookie('scaleCookie', i(scale), {path: '/'})
        setScale((prevState) => ++prevState);
    }

    useEffect(() => {
        document.documentElement.style.fontSize = scale + 'px';
    }, [scale])

    const toggleConfigurator = (event) => {
        setActive(prevState => !prevState);
    }

    const configClassName = classNames('layout-config', {
        'layout-config-active': active
    })

    const replaceLink = useCallback((linkElement, href, callback) => {
        if (isIE()) {
            linkElement.setAttribute('href', href);

            if (callback) {
                callback();
            }
        }
        else {
            const id = linkElement.getAttribute('id');
            const cloneLinkElement = linkElement.cloneNode(true);

            cloneLinkElement.setAttribute('href', href);
            cloneLinkElement.setAttribute('id', id + '-clone');

            linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

            cloneLinkElement.addEventListener('load', () => {
                linkElement.remove();
                cloneLinkElement.setAttribute('id', id);

                if (callback) {
                    callback();
                }
            });
        }
    },[])

    useEffect(() => {
        let themeElement = document.getElementById('theme-link');
        const themeHref = 'assets/themes/' + theme + '/theme.css';
        replaceLink(themeElement, themeHref);

    },[theme,replaceLink])

    const isIE = () => {
        return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent)
    }

    const changeTheme = (e, theme, scheme) => {
        props.onColorModeChange(scheme);
        setTheme(theme);
        setCookie('themeCookie', theme, {path:'/'})
    }

    return (
        <div ref={config} className={configClassName} id={"layout-config"}>
            <Route path="/dash">
                <button className="layout-config-button p-link" id="layout-config-button" onClick={toggleConfigurator}>
                    <i className="pi pi-cog"></i>
                </button>
                <Button className="p-button-danger layout-config-close p-button-rounded p-button-text" icon="pi pi-times" onClick={hideConfigurator}/>

                <div className="layout-config-content">
                    <h5 className="mt-0">Tamaño Items</h5>
                    <div className="config-scale">
                        <Button icon="pi pi-minus" onClick={decrementScale} className="p-button-text" disabled={scale === scales[0]} />
                        {
                            scales.map((item) => {
                                return <i className={classNames('pi pi-circle-on', {'scale-active': item === scale})} key={item}/>
                            })
                        }
                        <Button icon="pi pi-plus" onClick={incrementScale} className="p-button-text" disabled={scale === scales[scales.length - 1]} />
                    </div>

                    <h5>Tipo Menu</h5>
                    <div className="p-formgroup-inline">
                        <div className="field-radiobutton">
                            <RadioButton inputId="static" name="layoutMode" value="static" onChange={(e) => props.onLayoutModeChange(e.value)} checked={props.layoutMode === 'static'} />
                            <label htmlFor="static">Estatico</label>
                        </div>
                        <div className="field-radiobutton">
                            <RadioButton inputId="overlay" name="layoutMode" value="overlay" onChange={(e) => props.onLayoutModeChange(e.value)} checked={props.layoutMode === 'overlay'} />
                            <label htmlFor="overlay">Oculto</label>
                        </div>
                    </div>

                    <h5>Estilo Pagina</h5>
                    <div className="grid free-themes">
                        <div className="col-3 text-center">
                            <button className="p-link" onClick={(e) => changeTheme(e, 'lara-light-indigo', 'light')}>
                                <div className='p-1 pb-2' style={{background: "var(--bluegray-50)", borderRadius: "10px"}}>
                                    <img src='images/logo-principal.svg' alt="Lara Light Indigo"/>
                                </div>
                            </button>
                        </div>
                        <div className="col-3 text-center">
                            <button className="p-link" onClick={(e) => changeTheme(e, 'lara-light-blue', 'light')}>
                                <img src="assets/layout/images/themes/lara-light-blue.png" alt="Lara Light Blue"/>
                            </button>
                        </div>
                        <div className="col-3 text-center">
                            <button className="p-link" onClick={(e) => changeTheme(e, 'lara-light-purple', 'light')}>
                                <img src="assets/layout/images/themes/lara-light-purple.png" alt="Lara Light Purple"/>
                            </button>
                        </div>
                        <div className="col-3 text-center">
                            <button className="p-link" onClick={(e) => changeTheme(e, 'lara-light-teal', 'light')}>
                                <img src="assets/layout/images/themes/lara-light-teal.png" alt="Lara Light Teal"/>
                            </button>
                        </div>
                        <div className="col-3 text-center">
                            <button className="p-link" onClick={(e) => changeTheme(e, 'lara-dark-indigo', 'dark')}>
                                <div className='p-1 pb-2' style={{background: "var(--bluegray-900)", borderRadius: "10px"}}>
                                    <img src="images/logo-principal.svg" alt="Lara Dark Indigo"/>
                                </div>
                            </button>
                        </div>
                        <div className="col-3 text-center">
                            <button className="p-link" onClick={(e) => changeTheme(e, 'lara-dark-blue', 'dark')}>
                                <img src="assets/layout/images/themes/lara-dark-blue.png" alt="Lara Dark Blue"/>
                            </button>
                        </div>
                        <div className="col-3 text-center">
                            <button className="p-link" onClick={(e) => changeTheme(e, 'lara-dark-purple', 'dark')}>
                                <img src="assets/layout/images/themes/lara-dark-purple.png" alt="Lara Dark Purple"/>
                            </button>
                        </div>
                        <div className="col-3 text-center">
                            <button className="p-link" onClick={(e) => changeTheme(e, 'lara-dark-teal', 'dark')}>
                                <img src="assets/layout/images/themes/lara-dark-teal.png" alt="Lara Dark Teal"/>
                            </button>
                        </div>
                    </div>
                </div>
            </Route>
        </div>
    );
}
