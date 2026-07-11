import type { ReactNode } from 'react';

interface PrintableDocumentProps {
    children: ReactNode;
    title: string;
    size?: 'thermal' | 'a6' | 'a4';
}

export default function PrintableDocument({
    children,
    title,
    size = 'thermal',
}: PrintableDocumentProps) {
    const pageStyles = {
        thermal: { size: '80mm 297mm', margin: '0 0 0 0' },
        a6: { size: '105mm 148mm', margin: '5mm' },
        a4: { size: '210mm 297mm', margin: '15mm' },
    }[size];

    return (
        <>
            <style>{`
                @media print {
                    @page {
                        size: ${pageStyles.size};
                        margin: ${pageStyles.margin};
                    }

                    body {
                        margin: 0;
                        padding: 0;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    .print\\:hidden {
                        display: none !important;
                    }

                    .print-only {
                        display: block !important;
                    }

                    .no-break {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }

                    aside,
                    [data-surface="dashboard"] header,
                    footer {
                        display: none !important;
                    }

                    [data-surface="dashboard"] > div:last-child {
                        margin-left: 0 !important;
                    }

                    [data-surface="dashboard"] > div:last-child > div:first-child {
                        border: none !important;
                    }
                }

                @media screen {
                    .print-only {
                        display: none;
                    }
                }

                .print-document {
                    font-family: 'Instrument Sans', 'Segoe UI', system-ui, sans-serif;
                    color: #000;
                    background: #fff;
                    width: 100%;
                }

                .print-document.thermal {
                    max-width: 80mm;
                    padding: 4mm 3mm;
                    font-size: 9px;
                    line-height: 1.25;
                }

                .print-document.thermal h1 {
                    font-size: 14px;
                }

                .print-document.thermal h2 {
                    font-size: 11px;
                }

                .print-document.a6 {
                    max-width: 105mm;
                    padding: 5mm;
                    font-size: 10px;
                }

                .print-document.a4 {
                    max-width: 210mm;
                    padding: 15mm;
                    font-size: 11px;
                }

                .print-document table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .print-document th,
                .print-document td {
                    padding: 2px 4px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }

                .print-document .header {
                    text-align: center;
                    border-bottom: 2px solid #000;
                    padding-bottom: 4px;
                    margin-bottom: 8px;
                }

                .print-document .header h1 {
                    margin: 0;
                    font-family: 'Gabarito', sans-serif;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .print-document .header p {
                    margin: 2px 0 0;
                    font-size: 0.85em;
                    color: #555;
                }

                .print-document .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4px;
                    margin-bottom: 8px;
                }

                .print-document .info-grid .box {
                    border: 1px solid #ccc;
                    padding: 4px 6px;
                }

                .print-document .info-grid .box .label {
                    font-size: 0.75em;
                    color: #666;
                    margin-bottom: 1px;
                }

                .print-document .info-grid .box .value {
                    font-weight: 600;
                    color: #000;
                }

                .print-document .totals {
                    margin-top: 8px;
                    border-top: 2px solid #000;
                    padding-top: 4px;
                }

                .print-document .totals .row {
                    display: flex;
                    justify-content: space-between;
                    padding: 2px 0;
                }

                .print-document .totals .row.total {
                    font-weight: 700;
                    font-size: 1.1em;
                    border-top: 1px solid #000;
                    padding-top: 4px;
                    margin-top: 2px;
                }

                .print-document .footer {
                    margin-top: 8px;
                    border-top: 1px solid #ccc;
                    padding-top: 4px;
                    text-align: center;
                    font-size: 0.75em;
                    color: #888;
                }

                .print-document .signatures {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 8px;
                    margin-top: 16px;
                }

                .print-document .signatures .sig-box {
                    text-align: center;
                }

                .print-document .signatures .sig-box .line {
                    margin-top: 32px;
                    border-top: 1px solid #000;
                    padding-top: 4px;
                    font-size: 0.85em;
                }
            `}</style>

            <div className={`print-document ${size}`}>
                {children}
            </div>

            <div className="print:hidden mt-6 flex justify-center">
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="cursor-pointer border-none bg-[var(--brand)] px-6 py-3 text-sm font-medium text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-strong)]"
                >
                    Cetak {title}
                </button>
            </div>
        </>
    );
}
