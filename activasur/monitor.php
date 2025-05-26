<?php
/**
 * @version     1.0.0
 * @package     com_iactiva
 * @copyright   Copyright (C) 2021. All rights reserved.
 * @author      Clemente Solana Molina <clemente.solana@gmail.com>
 */
// No direct access to this file
defined('_JEXEC') or die('Restricted access');
$user = JFactory::getUser();
?>

<div uk-modal id="errorFichado">
    // ... existing code ...
</div>

<div class="uk-margin">
    <h3>Eventos en los que participo</h3>
</div>

<div id="prueba">
    <div class="uk-card uk-card-default">
        <div class="uk-card-body">
            <table class="uk-table uk-table-divider uk-table-striped uk-table-responsive uk-table-middle">
                <thead>
                    <tr>
                        <th>Título del Evento</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($this->eventos as $evento) { ?>
                        <tr>
                            <td>
                                <strong><?php echo htmlspecialchars($evento->titulo); ?></strong>
                            </td>
                            <td>
                                Del <?php echo date('d/m/Y H:i', $evento->detalles->inicio); ?> al <?php echo date('d/m/Y H:i', $evento->detalles->fin); ?>
                            </td>
                            <td>
                                <?php echo $evento->detalles->razon_social_cliente; ?>
                            </td>
                            <td>
                                <?php if ($evento->detalles->estado == Utils_IactivaHelper::ESTADO_EVENTO_ASIGNADO) { ?>
                                    <span class="uk-label uk-label-primary">Asignado</span>
                                <?php } elseif ($evento->detalles->estado == Utils_IactivaHelper::ESTADO_EVENTO_COMUNICADO) { ?>
                                    <span class="uk-label uk-label-success">Comunicado</span>
                                <?php } elseif ($evento->detalles->estado == Utils_IactivaHelper::ESTADO_EVENTO_CANCELADO) { ?>
                                    <span class="uk-label uk-label-warning">Cancelado</span>
                                <?php } ?>
                            </td>
                            <td>
                                <div class="uk-button-group">
                                    <button class="uk-button uk-button-small uk-button-primary checklist-btn" 
                                            data-event-id="<?php echo $evento->id; ?>"
                                            uk-tooltip="Ver checklist de materiales">
                                        <i class="fas fa-clipboard-check"></i> Checklist
                                    </button>
                                    <?php if ($evento->detalles->estado != Utils_IactivaHelper::ESTADO_EVENTO_CANCELADO) { ?>
                                        <button class="uk-button uk-button-small uk-button-secondary fichar-btn" 
                                                data-id_evento="<?php echo $evento->id; ?>"
                                                uk-tooltip="Fichar entrada/salida">
                                            <i class="fas fa-clock"></i> Fichar
                                        </button>
                                    <?php } ?>
                                </div>
                            </td>
                        </tr>
                    <?php } ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Modal para el checklist de materiales -->
<div id="checklistModal" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <h2 class="uk-modal-title">Checklist de Materiales</h2>
        <div id="checklistContent">
            <!-- El contenido se cargará dinámicamente -->
        </div>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button">Cerrar</button>
            <button class="uk-button uk-button-primary" id="guardarChecklist" type="button">Guardar</button>
        </div>
    </div>
</div>

<script type="text/javascript">
jQuery(document).ready(function() {
    // Función para cargar el checklist de materiales
    function cargarChecklist(eventoId) {
        jQuery.ajax({
            url: 'index.php?option=com_iactiva&task=inicio.getChecklistMateriales&format=json',
            type: 'POST',
            data: {
                evento_id: eventoId
            },
            success: function(response) {
                if (response.success) {
                    let html = '<div class="uk-margin">';
                    response.data.forEach(function(actividad) {
                        html += `<h4>${actividad.nombre}</h4>`;
                        html += '<ul class="uk-list uk-list-bullet">';
                        actividad.materiales.forEach(function(material) {
                            html += `
                                <li>
                                    <label>
                                        <input class="uk-checkbox material-checkbox" 
                                               type="checkbox" 
                                               data-material-id="${material.id}"
                                               data-actividad-id="${actividad.id}"
                                               ${material.checked ? 'checked' : ''}>
                                        ${material.cantidad}x ${material.nombre}
                                    </label>
                                </li>`;
                        });
                        html += '</ul>';
                    });
                    html += '</div>';
                    jQuery('#checklistContent').html(html);
                }
            }
        });
    }

    // Abrir modal de checklist
    jQuery(document).on('click', '.checklist-btn', function() {
        let eventoId = jQuery(this).data('event-id');
        cargarChecklist(eventoId);
        UIkit.modal('#checklistModal').show();
    });

    // Guardar estado del checklist
    jQuery('#guardarChecklist').on('click', function() {
        let materiales = [];
        jQuery('.material-checkbox:checked').each(function() {
            materiales.push({
                material_id: jQuery(this).data('material-id'),
                actividad_id: jQuery(this).data('actividad-id')
            });
        });

        jQuery.ajax({
            url: 'index.php?option=com_iactiva&task=inicio.guardarChecklistMateriales&format=json',
            type: 'POST',
            data: {
                materiales: materiales
            },
            success: function(response) {
                if (response.success) {
                    UIkit.notification({
                        message: 'Checklist guardado correctamente',
                        status: 'success'
                    });
                    UIkit.modal('#checklistModal').hide();
                }
            }
        });
    });

    // Mantener el código existente de fichaje
    jQuery(document).on('click', "#cerrarError", function(event) {
        UIkit.modal('#errorFichado').hide();
    });

    jQuery(document).on('click', "#aceptar", function(event) {
        UIkit.modal('#errorFichado').hide();
        let chivato = false;
        jQuery("#prueba").load(location.href + " #prueba");
        jQuery("#recargar").load(location.href + " #recargar");
        jQuery(".botonFichar").each(function() {
            if ($(this).text() == "Terminar" && chivato == false) {
                UIkit.modal('#terminarJornada').show();
                chivato = true;
            }
        });
    });

    jQuery(document).on('click', "#fichar", function(event) {
        let id_evento = jQuery(this).data('id_evento');
        if (event.target.innerHTML == "Terminar") {
            UIkit.modal('#errorFichado').show();
        }
        jQuery.ajax({
            type: "POST",
            data: {
                "id_evento": id_evento
            },
            url: "index.php?option=com_iactiva&task=inicio.setFichado&format=json",
            success: function(r) {
                if (r) {
                    if (event.target.innerHTML == "Terminar") {
                        UIkit.modal('#errorFichado').show();
                    } else {
                        jQuery("#prueba").load(location.href + " #prueba");
                        jQuery("#recargar").load(location.href + " #recargar");
                        let chivato2 = false;
                        jQuery(".botonFichar").each(function() {
                            if ($(this).text() == "Terminar" && chivato2 == false) {
                                UIkit.modal('#terminarJornada').show();
                                chivato2 = true;
                            }
                        });
                    }
                } else {
                    alert(r.message);
                }
            }
        });
    });
});
</script> 