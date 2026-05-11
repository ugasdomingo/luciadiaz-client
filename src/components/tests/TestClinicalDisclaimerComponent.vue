<template>
    <aside class="clinical-disclaimer" role="note" aria-label="Aviso clínico importante">
        <div class="clinical-disclaimer__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3C9.5 3 7.5 4.5 6.5 6.5C5 6.2 3.5 7 3 8.5C2.5 10 3 11.5 4 12.5C4 15.5 6.5 18 9.5 18H10V21H14V18H14.5C17.5 18 20 15.5 20 12.5C21 11.5 21.5 10 21 8.5C20.5 7 19 6.2 17.5 6.5C16.5 4.5 14.5 3 12 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M9 11C9 11 9.5 13 12 13C14.5 13 15 11 15 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="9.5" cy="9.5" r="0.75" fill="currentColor"/>
                <circle cx="14.5" cy="9.5" r="0.75" fill="currentColor"/>
            </svg>
        </div>
        <div class="clinical-disclaimer__body">
            <p>
                Bajo ningún concepto estos resultados constituyen un diagnóstico clínico, un peritaje psicológico o una evaluación psicométrica definitiva. La psique humana es dinámica y compleja; por tanto, una interpretación rigurosa de estos datos sólo puede realizarse dentro del marco de una relación terapéutica formal y bajo la supervisión de un profesional de la salud mental colegiado.
            </p>
            <p>
                Si te encuentras en una situación de crisis, experimentas malestar clínico significativo o requieres un diagnóstico formal, te invito a que agendes una sesión de valoración personalizada o acudas a los servicios de salud de tu localidad. El uso de esta herramienta implica la aceptación de que la información aquí facilitada es un recurso de apoyo al insight y no sustituye el criterio médico o psicológico profesional.
            </p>
        </div>
    </aside>
</template>

<style scoped lang="scss">
.clinical-disclaimer {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    background: #FFF8E1;
    border: 1px solid #F5C518;
    border-left: 4px solid #D4A017;
    border-radius: 12px;
    padding: 20px 24px;
    margin: 40px auto 0;
    max-width: 780px;
    box-sizing: border-box;

    &__icon {
        font-size: 22px;
        line-height: 1;
        flex-shrink: 0;
        margin-top: 2px;
        color: #D4A017;
    }

    &__body {
        p {
            margin: 0 0 10px;
            font-size: 13px;
            line-height: 1.7;
            color: #5C4500;

            &:last-child { margin-bottom: 0; }
        }
    }
}
</style>
