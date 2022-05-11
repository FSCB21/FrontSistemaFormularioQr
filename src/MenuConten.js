export default [
    {
        items: [{
            label: 'Dashboard', icon: 'pi pi-fw pi-briefcase', to: '/dash/'
        }]
    },
    {
        items: [{
            label: 'Plantilla Dashboard', icon: 'pi pi-fw pi-home', to: '/dash/plantilla'
        }]
    },
    {
        items: [{
            label:'Usuarios',
            icon: 'pi pi-fw pi-user',
            items: [
                {label: 'Todos Los Usuarios', icon: 'pi pi-fw pi-users', to: '/dash/usuarios'},
                {label: 'Codigo Canjeado', icon: 'pi pi-fw pi-check-circle', to: '/dash/usuarios-canjeado',},
                {label: 'Codigo Sin Canjear', icon: 'pi pi-fw pi-times-circle', to: '/dash/usuarios-sin-canjear',},
                {label: 'Generar Reporte', icon: 'pi pi-fw pi-book', to: '/dash/reporte',}
            ]
        }]
    },
    {
        items: [{
            label: 'Lugar Registro', icon: 'pi pi-fw pi-building', to: '/dash/lugar-registro'
        }]
    },
]