export const METRIC_CONFIG = {
    dots: { label: 'DOTS', key: 'dots' },
    ipf_gl: { label: 'IPF GL', key: 'ipf_gl' },
    wilks: { label: 'Wilks', key: 'wilks' },
    reshel: { label: 'Reshel', key: 'reshel' }
} as const;

export type MetricKey = keyof typeof METRIC_CONFIG;
