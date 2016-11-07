/* global set, loadFixtures */
describe('FlickityService', () => {
    let $compile;
    let $rootScope;

    // Include the module
    beforeEach(angular.mock.module('bc.Flickity'));

    beforeEach(function() {

        inject(function($compile, $rootScope, FlickityService) {
            this.$compile = $compile;
            this.$rootScope = $rootScope;
            this.FlickityService = FlickityService;

            this.$scope = this.$rootScope.$new();
            this.$scope.slides = [
                'http://cdn.benjamincharity.com/codepen/angular-flickity/slide1.jpg',
                'http://cdn.benjamincharity.com/codepen/angular-flickity/slide2.jpg',
                'http://cdn.benjamincharity.com/codepen/angular-flickity/slide3.jpg',
                'http://cdn.benjamincharity.com/codepen/angular-flickity/slide4.jpg',
            ];
        });

    });


    beforeEach(function() {
        this.compileDirective = function(template) {
            this.element = this.$compile(template)(this.$scope);
            this.$scope.$digest();
        };
    });


    afterEach(function() {
        this.element.remove();
    });

    describe('create()', () => {

        it(`should instantiate a Flickity instance with a custom ID`, function(done) {
            const template = angular.element(`
                <div id="js_demo">
                    <figure data-ng-repeat="slide in slides track by $index">
                        <img data-ng-src="{{ slide }}" alt="" />
                    </figure>
                </div>
            `);
            this.compileDirective(template);
            const customID = 'myId';

            this.FlickityService.create(this.element[0], customID).then((instance) => {
                const actual = instance.id;
                const expected = customID;

                expect(actual).toEqual(expected);
                done();
            });
        });

        it(`should instantiate a Flickity instance with the element's ID`, function(done) {
            const template = angular.element(`
                <div id="js_demo">
                    <figure data-ng-repeat="slide in slides track by $index">
                        <img data-ng-src="{{ slide }}" alt="" />
                    </figure>
                </div>
            `);
            this.compileDirective(template);

            this.FlickityService.create(this.element[0]).then((instance) => {
                const actual = instance.id;
                const expected = 'js_demo';

                expect(actual).toEqual(expected);
                done();
            });
        });

        it(`should instantiate a Flickity instance with a dynamic ID`, function(done) {
            const template = angular.element(`
                <div>
                    <figure data-ng-repeat="slide in slides track by $index">
                        <img data-ng-src="{{ slide }}" alt="" />
                    </figure>
                </div>
            `);
            this.compileDirective(template);

            this.FlickityService.create(this.element[0]).then((instance) => {
                const actual = instance.id;
                const expected = 1;

                expect(actual).toEqual(expected);
                done();
            });
        });

    });


    describe('destroy()', () => {

        it(`should destroy a Flickity instance`, function(done) {
            const template = angular.element(`
                <div id="js_demo">
                    <figure data-ng-repeat="slide in slides track by $index">
                        <img data-ng-src="{{ slide }}" alt="" />
                    </figure>
                </div>
            `);
            this.compileDirective(template);
            const testId = 'myTest';

            this.FlickityService.create(this.element[0], testId).then(() => {
                this.FlickityService.getAll().then((results) => {
                    const actual = results.length;
                    const expected = 1;

                    // Verify an instance was created
                    expect(actual).toEqual(expected);

                    this.FlickityService.destroy(testId).then(() => {
                        this.FlickityService.getAll().then((results) => {
                            const actual = results.length;
                            const expected = 0;

                            // Verify the instance was removed
                            expect(actual).toEqual(expected);
                            done();
                        });
                    });
                });
            });
        });

    });


    describe('getAll()', () => {

        it(`should return all instances`, function(done) {
            const template = angular.element(`
                <div id="js_demo">
                    <figure data-ng-repeat="slide in slides track by $index">
                        <img data-ng-src="{{ slide }}" alt="" />
                    </figure>
                </div>
            `);
            this.compileDirective(template);
            const idOne = 'testIdOne';
            const idTwo = 'testIdTwo';

            this.FlickityService.create(this.element[0], idOne).then(() => {
                this.FlickityService.getAll().then((results) => {
                    const actual = results.length;
                    const expected = 1;

                    // Verify a singe instance was returned
                    expect(actual).toEqual(expected);

                    this.FlickityService.create(this.element[0], idTwo).then(() => {
                        this.FlickityService.getAll().then((results) => {
                            const actual = results.length;
                            const expected = 2;

                            // Verify both instances are returned
                            expect(actual).toEqual(expected);
                            done();
                        });
                    });
                });
            });
        });

    });


    describe(`next()`, () => {

        it(`should move to the next slide`, function(done) {
            const template = angular.element(`
                <div id="js_demo">
                    <figure data-ng-repeat="slide in slides track by $index">
                        <img data-ng-src="{{ slide }}" alt="" />
                    </figure>
                </div>
            `);
            this.compileDirective(template);
            const testId = 'myTest';

            this.FlickityService.create(this.element[0], testId).then(() => {
                this.FlickityService.selectedIndex(testId).then((result) => {
                    const actual = result;
                    const expected = 0;

                    // Verify the index '0' is selected
                    expect(actual).toEqual(expected);

                    this.FlickityService.next(testId).then(() => {
                        this.FlickityService.selectedIndex(testId).then((result) => {
                            const actual = result;
                            const expected = 1;

                            // Verify the index '1' is selected
                            expect(actual).toEqual(expected);
                            done();
                        });
                    });
                });
            });
        });

        it(`should wrap when moving to the next slide`, function(done) {
            const template = angular.element(`
                <div id="js_demo">
                    <figure data-ng-repeat="slide in slides track by $index">
                        <img data-ng-src="{{ slide }}" alt="" />
                    </figure>
                </div>
            `);
            this.compileDirective(template);
            const testId = 'myTest';
            const options = {
                initialIndex: 3,
            };

            this.FlickityService.create(this.element[0], testId, options).then(() => {
                this.FlickityService.selectedIndex(testId).then((result) => {
                    const actual = result;
                    const expected = 3;

                    // Verify the index '3' is selected
                    expect(actual).toEqual(expected);

                    this.FlickityService.next(testId, true).then(() => {
                        this.FlickityService.selectedIndex(testId).then((result) => {
                            const actual = result;
                            const expected = 0;

                            // Verify the index '0' is selected
                            expect(actual).toEqual(expected);
                            done();
                        });
                    });
                });
            });
        });

    });


    describe(`previous()`, () => {

        it(`should move to the previous slide`, function(done) {
            const template = angular.element(`
                <div id="js_demo">
                    <figure data-ng-repeat="slide in slides track by $index">
                        <img data-ng-src="{{ slide }}" alt="" />
                    </figure>
                </div>
            `);
            this.compileDirective(template);
            const testId = 'myTest';
            const options = {
                initialIndex: 2,
            };

            this.FlickityService.create(this.element[0], testId, options).then(() => {
                this.FlickityService.selectedIndex(testId).then((result) => {
                    const actual = result;
                    const expected = 2;

                    // Verify the index '0' is selected
                    expect(actual).toEqual(expected);

                    this.FlickityService.previous(testId).then(() => {
                        this.FlickityService.selectedIndex(testId).then((result) => {
                            const actual = result;
                            const expected = 1;

                            // Verify the index '1' is selected
                            expect(actual).toEqual(expected);
                            done();
                        });
                    });
                });
            });
        });

        it(`should wrap when moving to the previous slide`, function(done) {
            const template = angular.element(`
                <div id="js_demo">
                    <figure data-ng-repeat="slide in slides track by $index">
                        <img data-ng-src="{{ slide }}" alt="" />
                    </figure>
                </div>
            `);
            this.compileDirective(template);
            const testId = 'myTest';

            this.FlickityService.create(this.element[0], testId).then(() => {
                this.FlickityService.selectedIndex(testId).then((result) => {
                    const actual = result;
                    const expected = 0;

                    // Verify the index '0' is selected
                    expect(actual).toEqual(expected);

                    this.FlickityService.previous(testId, true).then(() => {
                        this.FlickityService.selectedIndex(testId).then((result) => {
                            const actual = result;
                            const expected = 3;

                            // Verify the index '3' is selected
                            expect(actual).toEqual(expected);
                            done();
                        });
                    });
                });
            });
        });

    });


    describe(`select()`, () => {

        it(`should select a slide`, function(done) {
            const template = angular.element(`
                <div id="js_demo">
                    <figure data-ng-repeat="slide in slides track by $index">
                        <img data-ng-src="{{ slide }}" alt="" />
                    </figure>
                </div>
            `);
            this.compileDirective(template);
            const testId = 'myTest';
            const newIndex = 2;

            this.FlickityService.create(this.element[0], testId).then(() => {
                this.FlickityService.selectedIndex(testId).then((result) => {
                    const actual = result;
                    const expected = 0;

                    // Verify the index '0' is selected
                    expect(actual).toEqual(expected);

                    this.FlickityService.select(testId, newIndex).then(() => {
                        this.FlickityService.selectedIndex(testId).then((result) => {
                            const actual = result;
                            const expected = newIndex;

                            // Verify the index '2' is selected
                            expect(actual).toEqual(expected);
                            done();
                        });
                    });
                });
            });
        });

    });


    describe(`selectCell()`, () => {

        it(`should select a slide with a selector string`, function(done) {
            const template = angular.element(`
                <div id="js_demo">
                    <figure
                        class="slide{{ $index }}"
                        data-ng-repeat="slide in slides track by $index"
                    >
                        <img data-ng-src="{{ slide }}" alt="" />
                    </figure>
                </div>
            `);
            this.compileDirective(template);
            const testId = 'myTest';

            this.FlickityService.create(this.element[0], testId).then(() => {
                this.FlickityService.selectedIndex(testId).then((result) => {
                    const actual = result;
                    const expected = 0;

                    // Verify the index '0' is selected
                    expect(actual).toEqual(expected);

                    this.FlickityService.selectCell(testId, '.slide3').then(() => {
                        this.FlickityService.selectedIndex(testId).then((result) => {
                            const actual = result;
                            const expected = 3;

                            // Verify the index '3' is selected
                            expect(actual).toEqual(expected);
                            done();
                        });
                    });
                });
            });
        });

    });


    describe(`selectedIndex()`, () => {

        it(`should return the index of the current slide`, function(done) {
            const template = angular.element(`
                <div id="js_demo">
                    <figure data-ng-repeat="slide in slides track by $index">
                        <img data-ng-src="{{ slide }}" alt="" />
                    </figure>
                </div>
            `);
            this.compileDirective(template);
            const testId = 'myTest';
            const options = {
                initialIndex: 1,
            };

            this.FlickityService.create(this.element[0], testId, options).then(() => {
                this.FlickityService.selectedIndex(testId).then((result) => {
                    const actual = result;
                    const expected = 1;

                    // Verify the index '1' is selected
                    expect(actual).toEqual(expected);

                    this.FlickityService.next(testId).then(() => {
                        this.FlickityService.selectedIndex(testId).then((result) => {
                            const actual = result;
                            const expected = 2;

                            // Verify the index '2' is selected
                            expect(actual).toEqual(expected);
                            done();
                        });
                    });
                });
            });
        });

    });


    describe(`resize()`, () => {

        it(`should call resize() on the current instance`, function(done) {
            const template = angular.element(`
                <div id="js_demo">
                    <figure data-ng-repeat="slide in slides track by $index">
                        <img data-ng-src="{{ slide }}" alt="" />
                    </figure>
                </div>
            `);
            this.compileDirective(template);
            const customID = 'myId';

            this.FlickityService.create(this.element[0], customID).then((instance) => {
                const flickityInstance = instance.instance;
                const actual = instance.id;
                const expected = customID;

                expect(actual).toEqual(expected);

                spyOn(flickityInstance, 'resize');

                this.FlickityService.resize(customID).then((result) => {
                    expect(flickityInstance.resize).toHaveBeenCalled();
                    done();
                });
            });

        });

    });


    describe(`reposition()`, () => {

        it(`should call reposition() on the current instance`, function(done) {
            const template = angular.element(`
                <div id="js_demo">
                    <figure data-ng-repeat="slide in slides track by $index">
                        <img data-ng-src="{{ slide }}" alt="" />
                    </figure>
                </div>
            `);
            this.compileDirective(template);
            const customID = 'myId';

            this.FlickityService.create(this.element[0], customID).then((instance) => {
                const flickityInstance = instance.instance;
                const actual = instance.id;
                const expected = customID;

                expect(actual).toEqual(expected);

                spyOn(flickityInstance, 'reposition');

                this.FlickityService.reposition(customID).then((result) => {
                    expect(flickityInstance.reposition).toHaveBeenCalled();
                    done();
                });
            });

        });

    });


    describe(`reloadCells()`, () => {

        it(`should call reloadCells() on the current instance`, function(done) {
            const template = angular.element(`
                <div id="js_demo">
                    <figure data-ng-repeat="slide in slides track by $index">
                        <img data-ng-src="{{ slide }}" alt="" />
                    </figure>
                </div>
            `);
            this.compileDirective(template);
            const customID = 'myId';

            this.FlickityService.create(this.element[0], customID).then((instance) => {
                const flickityInstance = instance.instance;
                const actual = instance.id;
                const expected = customID;

                expect(actual).toEqual(expected);

                spyOn(flickityInstance, 'reloadCells');

                this.FlickityService.reloadCells(customID).then((result) => {
                    expect(flickityInstance.reloadCells).toHaveBeenCalled();
                    done();
                });
            });

        });

    });


    describe(`get()`, () => {

        it(`should return the instance with the matching ID`, function(done) {
            const template = angular.element(`
                <div id="js_demo">
                    <figure data-ng-repeat="slide in slides track by $index">
                        <img data-ng-src="{{ slide }}" alt="" />
                    </figure>
                </div>
            `);
            this.compileDirective(template);
            const customID = 'myId';

            this.FlickityService.create(this.element[0], customID).then((instance) => {
                const actual = instance.id;
                const expected = customID;

                expect(actual).toEqual(expected);

                this.FlickityService.get(customID).then((result) => {
                    const actual = result.id;
                    const expected = customID;

                    expect(actual).toEqual(expected);
                    done();
                });
            });

        });

    });



});
