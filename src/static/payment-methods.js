/**
 * Métodos de pago offline organizados por región.
 * Cada método contiene los datos necesarios para que el cliente realice el pago.
 */

export const paymentMethods = [
    {
        id: 'zelle',
        name: 'Zelle',
        region: 'Estados Unidos',
        icon: '🇺🇸',
        details: [
            { label: 'Email', value: 'luciadiaz@email.com' },
            { label: 'Titular', value: 'Lucía Díaz' },
        ]
    },
    {
        id: 'pago_movil',
        name: 'Pago Móvil',
        region: 'Venezuela',
        icon: '🇻🇪',
        details: [
            { label: 'Teléfono', value: '0412-XXX-XXXX' },
            { label: 'Cédula', value: 'V-XX.XXX.XXX' },
            { label: 'Banco', value: 'Banco Ejemplo' },
        ]
    },
    {
        id: 'transferencia_eu',
        name: 'Transferencia Bancaria',
        region: 'Europa',
        icon: '🇪🇺',
        details: [
            { label: 'IBAN', value: 'ES00 0000 0000 0000 0000 0000' },
            { label: 'BIC/SWIFT', value: 'XXXXXXXX' },
            { label: 'Titular', value: 'Lucía Díaz' },
            { label: 'Banco', value: 'Banco Ejemplo' },
        ]
    }
]
