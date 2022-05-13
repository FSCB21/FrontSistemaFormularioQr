export default [
    {
        items: [{
            label: 'Dashboard', icon: 'pi pi-fw pi-briefcase', to: '/dash/'
        }]
    },
    {
        items: [{
            label:'Registros',
            icon: 'pi pi-fw pi-folder',
            items: [
                {label: 'Todos Los Registros', icon: 'pi pi-fw pi-list', to: '/dash/registros'},
                {label: 'Codigo Canjeado', icon: 'pi pi-fw pi-check-circle', to: '/dash/registros-canjeado',},
                {label: 'Codigo Sin Canjear', icon: 'pi pi-fw pi-times-circle', to: '/dash/registros-sin-canjear',},
                {label: 'Generar Reporte', icon: 'pi pi-fw pi-book', to: '/dash/reporte',},
                {label: 'Lugar Registro', icon: 'pi pi-fw pi-building', to: '/dash/lugar-registro'}
            ]
        }]
    },
    {
        items: [{label: 'Cumpleaños', icon: 'pi pi-fw pi-calendar', to: '/dash/cumpleaños'}]
    },
]