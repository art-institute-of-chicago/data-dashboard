(function () {
    'use strict';

    angular
        .module('app')
        .directive('tfield', Directive);

    Directive.$inject = [ '$state', '$stateParams', '$model', '$injector', 'MapperService'];

    function Directive( $state, $stateParams, $model, $injector, MapperService ) {
        return {
            restrict: 'A',
            template: `
                <td class="text-ellipsis">
                    <strong title="{{ label }}">{{ label }}</strong>
                </td>
                <td>

                    <div ng-if="!isLink">

                        <ul  ng-if="isArray( value )">
                            <li ng-repeat="item in value track by $index">{{ item }}</li>
                        </ul>

                        <span ng-if="!isArray( value )">{{ value }}</span>

                    </div>

                    <div ng-if="isLink">

                        <ul ng-if="isArray( value ) && isLink">
                            <li ng-repeat="item in value track by $index">
                                <a ui-sref="{{ item.state }}({ id: '{{ item.id }}' })">
                                    {{ item.entity.title }}
                                </a>
                            </li>
                        </ul>

                        <span ng-if="!isArray( value ) && isLink">
                            <a ui-sref="{{ value.state }}({ id: '{{ value.id }}' })">
                                {{ value.entity.title }}
                            </a>
                        </span>

                    </div>

                </td>
            `,
            scope: {
                key: '@',
                value: '=',
            },
            link: function( scope, element, attr ) {

                // Default: might be overriden
                scope.label = MapperService.getLabel( scope.key );

                scope.isArray = function( value ) {

                    // Wait until the value is ready...
                    if( !value ) {
                        return false;
                    }

                    return value.constructor === Array;

                }

                // Everything below here has to do w/ linked models!
                // TODO: Refactor me please!

                var model = $model.get( $state.current.name );

                if( !model.api.linked ) {
                    return true;
                }

                var isTitle = model.api.linked.some( function(e) { return e.title === scope.key } );
                var link = model.api.linked.find( function(e) { return e.field === scope.key } );
                var isLink = typeof link !== 'undefined';

                // Make isLink accessible to the view
                scope.isLink = isLink;

                // If this is the title field of a linked model, hide this element
                if( isTitle ) {
                    element.remove();
                }

                if( isLink ) {

                    // Get full model definition
                    var linkedModel = $model.get( link.model );

                    // Set the label equal to the label on the link definition, or on the linked model
                    scope.label = link.label || linkedModel.label;

                    // Parse the value (array or not) into { id, state, entity }
                    scope.value = link.many ? scope.value.map( getLinkedEntity ) : getLinkedEntity( scope.value );

                    function getLinkedEntity( id ) {

                        return {
                            id: id,
                            state: linkedModel.states.entity,
                            entity: $injector.get( linkedModel.service ).find( id ).clean,
                        };

                    }

                }

            }

        }

    }

}());
