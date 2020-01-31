<template>
    <div class="page-dev-ui" v-inital v-fullscreen>
        <navigation>
            <template slot="logo">
                <i class="icon-cui"></i>
            </template>
            <template slot="searchBox">
                <textboxAutocomplete name="search" v-model="search" v-validation.required placeholder="Search for..."></textboxAutocomplete>
            </template>
            <template slot="fixedMenus">
                <a href="javascript:;" class="btn small orange highlight">Demo Page</a>
            </template>
            <template slot="menus">
                <li class="list right">
                    <a href="">Login / Signup</a>
                    <ul>
                        <a href="javascript:;">Account Center</a>
                        <a href="javascript:;">Setting</a>
                        <a href="javascript:;">Quit</a>
                    </ul>
                </li>
                <li class="list">
                    <a href="">Typograph</a>
                    <ul>
                        <a href="javascript:;">Font</a>
                        <a href="javascript:;">paragraph</a>
                        <a href="javascript:;">Panel</a>
                        <a href="javascript:;">Section</a>
                        <a href="javascript:;">Grid Layout</a>
                        <a href="javascript:;">Flex Layout</a>
                        <a href="javascript:;">Table Layout</a>
                    </ul>
                </li>
                <li class="list">
                    <a href="">Component</a>
                    <ul>
                        <a href="javascript:;">Dialog</a>
                        <a href="javascript:;">Tabs</a>
                        <a href="javascript:;">Navigation</a>
                        <a href="javascript:;">Tips</a>
                        <a href="javascript:;">Carousel</a>
                        <a href="javascript:;">Waterfalls</a>
                    </ul>
                </li>
                <li class="list">
                    <a href="">Form</a>
                    <ul>
                        <a href="javascript:;">Textbox</a>
                        <a href="javascript:;">Dropdown</a>
                        <a href="javascript:;">Radio Button</a>
                        <a href="javascript:;">CHeckbox Button</a>
                        <a href="javascript:;">Radio Button</a>
                        <a href="javascript:;">Slider</a>
                        <a href="javascript:;">Validation</a>
                        <a href="javascript:;">Submit BUtton</a>
                    </ul>
                </li>
                <li class="list">
                    <a href="">Utilites</a>
                    <ul>
                        <a href="javascript:;">Google Dynamic Map</a>
                        <a href="javascript:;">Google Static Map</a>
                        <a href="javascript:;">Geo Autocompelte</a>
                        <a href="javascript:;">Lazyloading Image</a>
                    </ul>
                </li>
            </template>
        </navigation>
        <div class="flex-gs-fixed">
            <div class="flex-xs-12">
                <div class="section">
                    <h2 class="h2">Typograph</h2>
                    <div class="panel">
                        <div class="h4">Typograph text</div>
                        <div class="paragraph">
                            <span class="f1">A</span>
                            <span class="f2">A</span>
                            <span class="f3">A</span>
                            <span class="f4">A</span>
                            <span class="f5">A</span>
                            <span class="f6">A</span>
                            <span class="f7">A</span>
                            ------ the text level from level 1 to level 7
                        </div>
                    </div>
                    <div class="panel">
                        <div class="h4">Typograph title</div>
                        <div class="header-panel">
                            <div class="h1">The global title level to level 1</div>
                            <div class="h2">The global title level to level 2</div>
                            <div class="h3">The global title level to level 3</div>
                            <div class="h4">The global title level to level 4</div>
                            <div class="h5">The global title level to level 5</div>
                            <div class="h6">The global title level to level 6</div>
                        </div>
                    </div>
                    <div class="panel">
                        <div class="h4">Typograph paragraph</div>
                        <div class="paragraph">A specimen sheet of the Trajan typeface, which is based on the letter forms of capitalis monumentalis or Roman square capitals used for the inscription at the base of Trajan's Column, from which the typeface takes its name Movable type being assembled on a composing stick using pieces that are stored in the type case shown below it Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing (leading), and letter-spacing (tracking), and adjusting the space between pairs of letters (kerning[1]). The term typography is also applied to the style, arrangement, and appearance of the letters, numbers, and symbols created by the process.
                        </div>
                        <div class="h5">Paragraph two row with ellipsis</div>
                        <div class="paragraph">
                            <div class="multiline-2">
                                Typography is the work of typesetters (also known as compositors), typographers, graphic designers, art directors, manga artists, comic book artists, graffiti artists.
                            </div>
                        </div>
                        <div class="h5">Paragraph three row with ellipsis</div>
                        <div class="paragraph">
                            <div class="multiline-3">
                                Anyone who arranges words, letters, numbers, and symbols for publication, display, or distribution, from clerical workers and newsletter writers to anyone self-publishing materials. Until the Digital Age, typography was a specialized occupation.
                            </div>
                        </div>
                        <div class="h5">Paragraph four row with ellipsis</div>
                        <div class="paragraph">
                            <div class="multiline-4">
                                Digitization opened up typography to new generations of previously unrelated designers and lay users. As the capability to create typography has become ubiquitous, the application of principles and best practices developed over generations of skilled workers and professionals has diminished.
                            </div>
                        </div>
                        <div class="h5">Paragraph five row with ellipsis</div>
                        <div class="paragraph">
                            <div class="multiline-5">
                                So at a time when scientific techniques can support the proven traditions (e.g., greater legibility with the use of serifs, upper and lower case, contrast, etc.) through understanding the limitations of human vision, typography as often encountered may fail to achieve its principal objective: effective communication.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-xs-12">
                <div class="section">
                    <h2 class="h2">Form</h2>
                    <div class="panel">
                        <div class="h4">Form dropdown</div>
                        <div class="gs">
                            <div class="row">
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <dropdownRange :data="priceRange.data" v-model="priceRange.model" :options="priceRange.options"></dropdownRange>
                                </div>

                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <dropdownLink :data="beds.data" v-model="beds.model"></dropdownLink>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <dropdownCheckbox :data="tags.data" v-model="tags.model" :options="tags.options"></dropdownCheckbox>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel">
                        <div class="h4">Form dropdown small</div>
                        <div class="gs">
                            <div class="row">
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <dropdownRange :data="priceRange.data" :theme="'small'" v-model="priceRange.model" :options="priceRange.options"></dropdownRange>
                                </div>

                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <dropdownLink :data="beds.data" :theme="'small'" v-model="beds.model"></dropdownLink>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <dropdownCheckbox :data="tags.data" :theme="'small'" v-model="tags.model" :options="tags.options"></dropdownCheckbox>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel">
                        <div class="h4">Checkbox / Radio</div>
                        <div class="gs">
                            <div class="row">
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <checkbox :data="agreed.data" v-model="agreed.model"></checkbox>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <checkbox :data="fav.data" v-model="fav.model"></checkbox>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <radio :data="gender.data" v-model="gender.model"></radio>
                                </div>
                            </div>
                        </div>
                        <div class="h4">Checkbox Group / Radio Group</div>
                        <div class="gs">
                            <div class="row">
                                <div class="col-sm-6">
                                    <checkbox :data="fav.data" :theme="'group'" v-model="fav.model"></checkbox>
                                </div>
                                <div class="col-sm-6">
                                    <radio :data="gender.data" :theme="'group'" v-model="gender.model"></radio>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel">
                        <div class="h4">Form textbox</div>
                        <div class="gs">
                            <div class="row">
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <textbox type="email" name="email" v-model="email" v-validation.required.email placeholder="Email">
                                    </textbox>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <textbox type="number" name="phone" v-model="phone" v-validation.required.phone placeholder="Mobile Number">
                                        <i slot="left" class="icon-phone"></i>
                                    </textbox>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <textbox type="password" name="password" v-model="password" v-validation.required placeholder="Password">
                                        <i slot="left" class="icon-eye"></i>
                                    </textbox>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-12">
                                    <textbox type="text" name="search" v-model="search" v-validation.required placeholder="Search for...">
                                        <a slot="right" href="javascript:;" class="btn orange active"><i class="icon-search"></i></a>
                                    </textbox>
                                </div>
                                <div class="col-xs-12">
                                    <!-- <textbox>
                                        <div class="textarea">
                                            <label>Comment</label>
                                            <textarea name="comment" v-model="comment" maxlength="4000"></textarea>
                                        </div>
                                    </textbox> -->
                                </div>
                            </div>
                        </div>
                        <div class="h4">Form textbox small </div>
                        <div class="gs">
                            <div class="row">
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <textbox class="small" type="email" name="email1" v-model="email" v-validation.required.email placeholder="Email">
                                    </textbox>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <textbox class="small" type="number" name="phone1" v-model="phone" v-validation.required.phone placeholder="Mobile Number">
                                        <i slot="left" class="icon-phone"></i>
                                    </textbox>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <textbox class="small" type="password" name="password1" v-model="password" v-validation.required placeholder="Password">
                                        <i slot="left" class="icon-eye"></i>
                                    </textbox>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-12">
                                    <textbox class="small" type="text" name="search1" v-model="search" v-validation.required placeholder="Search for...">
                                        <a slot="right" href="javascript:;" class="btn orange active"><i class="icon-search"></i></a>
                                    </textbox>
                                </div>
                                <!-- <div class="col-xs-12">
                                    <textbox>
                                        <div class="textarea">
                                            <label>Comment</label>
                                            <textarea name="comment" v-model="comment1" maxlength="4000"></textarea>
                                        </div>
                                    </textbox>
                                </div> -->
                            </div>
                        </div>
                    </div>
                    <div class="panel">
                        <div class="h4">Form button</div>
                        <div class="gs">
                            <div class="row">
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn default" href="javascript:void(0)"><i class="icon-square"></i> <span>Default Button</span> </a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn default active" href="javascript:void(0)"><i class="icon-check-square"></i> Default Button</a>
                                </div>

                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn link" href="javascript:void(0)"><i class="icon-square"></i> Link Button</a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn link active" href="javascript:void(0)"><i class="icon-check-square"></i> Link Button</a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn orange" href="javascript:void(0)"><i class="icon-square"></i> Highlight Button</a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn orange active" href="javascript:void(0)"><i class="icon-check-square"></i> Highlight Button</a>
                                </div>

                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn default loading" href="javascript:void(0)"><i class="icon-clock"></i> loading</a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn default" href="javascript:void(0)" disabled><i class="icon-lock"></i> Disable Button</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel">
                        <div class="h4">Form button small</div>
                        <div class="gs">
                            <div class="row">
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn small default" href="javascript:void(0)"><i class="icon-square"></i> Default Button</a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn small default active" href="javascript:void(0)"><i class="icon-check-square"></i> Default Button</a>
                                </div>

                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn small link" href="javascript:void(0)"><i class="icon-square"></i> Link Button</a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn small link active" href="javascript:void(0)"><i class="icon-check-square"></i> Link Button</a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn small orange" href="javascript:void(0)"><i class="icon-square"></i> Highlight Button</a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn small orange active" href="javascript:void(0)"><i class="icon-check-square"></i> Highlight Button</a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn small default loading" href="javascript:void(0)"><i class="icon-clock"></i> loading</a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn small default" href="javascript:void(0)" disabled><i class="icon-lock"></i> Disable Button</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel">
                        <div class="h4">Form standard layout</div>
                        <div class="form-default">

                        </div>
                    </div>
                </div>

            </div>
            <div class="flex-xs-12">
                <div class="section">
                    <h2 class="h2">Icon</h2>
                    <div class="panel">
                        <div class="gs icons">
                            <div class="row">
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cui"></i><br><span>cui</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-asterisk"></i><br><span>asterisk</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-plus"></i><br><span>plus</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-question"></i><br><span>question</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-minus"></i><br><span>minus</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-glass"></i><br><span>glass</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-music"></i><br><span>music</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-search"></i><br><span>search</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-envelope-o"></i><br><span>envelope-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-heart"></i><br><span>heart</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-star"></i><br><span>star</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-star-o"></i><br><span>star-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-user"></i><br><span>user</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-film"></i><br><span>film</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-th-large"></i><br><span>th-large</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-th"></i><br><span>th</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-th-list"></i><br><span>th-list</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-check"></i><br><span>check</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-close"></i><br><span>close</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-remove"></i><br><span>remove</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-times"></i><br><span>times</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-search-plus"></i><br><span>search-plus</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-search-minus"></i><br><span>search-minus</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-power-off"></i><br><span>power-off</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-signal"></i><br><span>signal</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cog"></i><br><span>cog</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-gear"></i><br><span>gear</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-trash-o"></i><br><span>trash-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-home"></i><br><span>home</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-file-o"></i><br><span>file-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-clock-o"></i><br><span>clock-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-road"></i><br><span>road</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-download"></i><br><span>download</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-arrow-circle-o-down"></i><br><span>arrow-circle-o-down</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-arrow-circle-o-up"></i><br><span>arrow-circle-o-up</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-inbox"></i><br><span>inbox</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-play-circle-o"></i><br><span>play-circle-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-repeat"></i><br><span>repeat</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-rotate-right"></i><br><span>rotate-right</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-refresh"></i><br><span>refresh</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-list-alt"></i><br><span>list-alt</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-lock"></i><br><span>lock</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-flag"></i><br><span>flag</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-headphones"></i><br><span>headphones</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-volume-off"></i><br><span>volume-off</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-volume-down"></i><br><span>volume-down</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-volume-up"></i><br><span>volume-up</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-qrcode"></i><br><span>qrcode</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-barcode"></i><br><span>barcode</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-tag"></i><br><span>tag</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-tags"></i><br><span>tags</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-book"></i><br><span>book</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bookmark"></i><br><span>bookmark</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-print"></i><br><span>print</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-camera"></i><br><span>camera</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-font"></i><br><span>font</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bold"></i><br><span>bold</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-italic"></i><br><span>italic</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-text-height"></i><br><span>text-height</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-text-width"></i><br><span>text-width</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-align-left"></i><br><span>align-left</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-align-center"></i><br><span>align-center</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-align-right"></i><br><span>align-right</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-align-justify"></i><br><span>align-justify</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-list"></i><br><span>list</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-dedent"></i><br><span>dedent</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-outdent"></i><br><span>outdent</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-indent"></i><br><span>indent</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-video-camera"></i><br><span>video-camera</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-image"></i><br><span>image</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-photo"></i><br><span>photo</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-picture-o"></i><br><span>picture-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-pencil"></i><br><span>pencil</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-map-marker"></i><br><span>map-marker</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-adjust"></i><br><span>adjust</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-tint"></i><br><span>tint</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-edit"></i><br><span>edit</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-pencil-square-o"></i><br><span>pencil-square-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-share-square-o"></i><br><span>share-square-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-check-square-o"></i><br><span>check-square-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-arrows"></i><br><span>arrows</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-step-backward"></i><br><span>step-backward</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-fast-backward"></i><br><span>fast-backward</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-backward"></i><br><span>backward</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-play"></i><br><span>play</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-pause"></i><br><span>pause</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-stop"></i><br><span>stop</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-forward"></i><br><span>forward</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-fast-forward"></i><br><span>fast-forward</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-step-forward"></i><br><span>step-forward</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-eject"></i><br><span>eject</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-chevron-left"></i><br><span>chevron-left</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-chevron-right"></i><br><span>chevron-right</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-plus-circle"></i><br><span>plus-circle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-minus-circle"></i><br><span>minus-circle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-times-circle"></i><br><span>times-circle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-check-circle"></i><br><span>check-circle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-question-circle"></i><br><span>question-circle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-info-circle"></i><br><span>info-circle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-crosshairs"></i><br><span>crosshairs</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-times-circle-o"></i><br><span>times-circle-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-check-circle-o"></i><br><span>check-circle-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-ban"></i><br><span>ban</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-arrow-left"></i><br><span>arrow-left</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-arrow-right"></i><br><span>arrow-right</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-arrow-up"></i><br><span>arrow-up</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-arrow-down"></i><br><span>arrow-down</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-mail-forward"></i><br><span>mail-forward</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-share"></i><br><span>share</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-expand"></i><br><span>expand</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-compress"></i><br><span>compress</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-exclamation-circle"></i><br><span>exclamation-circle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-gift"></i><br><span>gift</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-leaf"></i><br><span>leaf</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-fire"></i><br><span>fire</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-eye"></i><br><span>eye</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-eye-slash"></i><br><span>eye-slash</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-exclamation-triangle"></i><br><span>exclamation-triangle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-warning"></i><br><span>warning</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-plane"></i><br><span>plane</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-calendar"></i><br><span>calendar</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-random"></i><br><span>random</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-comment"></i><br><span>comment</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-magnet"></i><br><span>magnet</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-chevron-up"></i><br><span>chevron-up</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-chevron-down"></i><br><span>chevron-down</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-retweet"></i><br><span>retweet</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-shopping-cart"></i><br><span>shopping-cart</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-folder"></i><br><span>folder</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-folder-open"></i><br><span>folder-open</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-arrows-v"></i><br><span>arrows-v</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-arrows-h"></i><br><span>arrows-h</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bar-chart"></i><br><span>bar-chart</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bar-chart-o"></i><br><span>bar-chart-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-twitter-square"></i><br><span>twitter-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-facebook-square"></i><br><span>facebook-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-camera-retro"></i><br><span>camera-retro</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-key"></i><br><span>key</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cogs"></i><br><span>cogs</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-gears"></i><br><span>gears</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-comments"></i><br><span>comments</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-thumbs-o-up"></i><br><span>thumbs-o-up</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-thumbs-o-down"></i><br><span>thumbs-o-down</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-star-half"></i><br><span>star-half</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-heart-o"></i><br><span>heart-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sign-out"></i><br><span>sign-out</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-linkedin-square"></i><br><span>linkedin-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-thumb-tack"></i><br><span>thumb-tack</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-external-link"></i><br><span>external-link</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sign-in"></i><br><span>sign-in</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-trophy"></i><br><span>trophy</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-github-square"></i><br><span>github-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-upload"></i><br><span>upload</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-lemon-o"></i><br><span>lemon-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-phone"></i><br><span>phone</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-square-o"></i><br><span>square-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bookmark-o"></i><br><span>bookmark-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-phone-square"></i><br><span>phone-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-twitter"></i><br><span>twitter</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-facebook"></i><br><span>facebook</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-facebook-f"></i><br><span>facebook-f</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-github"></i><br><span>github</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-unlock"></i><br><span>unlock</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-credit-card"></i><br><span>credit-card</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-feed"></i><br><span>feed</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-rss"></i><br><span>rss</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hdd-o"></i><br><span>hdd-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bullhorn"></i><br><span>bullhorn</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bell-o"></i><br><span>bell-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-certificate"></i><br><span>certificate</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hand-o-right"></i><br><span>hand-o-right</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hand-o-left"></i><br><span>hand-o-left</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hand-o-up"></i><br><span>hand-o-up</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hand-o-down"></i><br><span>hand-o-down</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-arrow-circle-left"></i><br><span>arrow-circle-left</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-arrow-circle-right"></i><br><span>arrow-circle-right</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-arrow-circle-up"></i><br><span>arrow-circle-up</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-arrow-circle-down"></i><br><span>arrow-circle-down</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-globe"></i><br><span>globe</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-wrench"></i><br><span>wrench</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-tasks"></i><br><span>tasks</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-filter"></i><br><span>filter</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-briefcase"></i><br><span>briefcase</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-arrows-alt"></i><br><span>arrows-alt</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-group"></i><br><span>group</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-users"></i><br><span>users</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-chain"></i><br><span>chain</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-link"></i><br><span>link</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cloud"></i><br><span>cloud</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-flask"></i><br><span>flask</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cut"></i><br><span>cut</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-scissors"></i><br><span>scissors</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-copy"></i><br><span>copy</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-files-o"></i><br><span>files-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-paperclip"></i><br><span>paperclip</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-floppy-o"></i><br><span>floppy-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-save"></i><br><span>save</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-square"></i><br><span>square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bars"></i><br><span>bars</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-navicon"></i><br><span>navicon</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-reorder"></i><br><span>reorder</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-list-ul"></i><br><span>list-ul</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-list-ol"></i><br><span>list-ol</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-strikethrough"></i><br><span>strikethrough</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-underline"></i><br><span>underline</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-table"></i><br><span>table</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-magic"></i><br><span>magic</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-truck"></i><br><span>truck</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-pinterest"></i><br><span>pinterest</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-pinterest-square"></i><br><span>pinterest-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-google-plus-square"></i><br><span>google-plus-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-google-plus"></i><br><span>google-plus</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-money"></i><br><span>money</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-caret-down"></i><br><span>caret-down</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-caret-up"></i><br><span>caret-up</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-caret-left"></i><br><span>caret-left</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-caret-right"></i><br><span>caret-right</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-columns"></i><br><span>columns</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sort"></i><br><span>sort</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-unsorted"></i><br><span>unsorted</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sort-desc"></i><br><span>sort-desc</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sort-down"></i><br><span>sort-down</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sort-asc"></i><br><span>sort-asc</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sort-up"></i><br><span>sort-up</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-envelope"></i><br><span>envelope</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-linkedin"></i><br><span>linkedin</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-rotate-left"></i><br><span>rotate-left</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-undo"></i><br><span>undo</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-gavel"></i><br><span>gavel</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-legal"></i><br><span>legal</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-dashboard"></i><br><span>dashboard</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-tachometer"></i><br><span>tachometer</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-comment-o"></i><br><span>comment-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-comments-o"></i><br><span>comments-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bolt"></i><br><span>bolt</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-flash"></i><br><span>flash</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sitemap"></i><br><span>sitemap</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-umbrella"></i><br><span>umbrella</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-clipboard"></i><br><span>clipboard</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-paste"></i><br><span>paste</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-lightbulb-o"></i><br><span>lightbulb-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-exchange"></i><br><span>exchange</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cloud-download"></i><br><span>cloud-download</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cloud-upload"></i><br><span>cloud-upload</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-user-md"></i><br><span>user-md</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-stethoscope"></i><br><span>stethoscope</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-suitcase"></i><br><span>suitcase</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bell"></i><br><span>bell</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-coffee"></i><br><span>coffee</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cutlery"></i><br><span>cutlery</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-file-text-o"></i><br><span>file-text-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-building-o"></i><br><span>building-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hospital-o"></i><br><span>hospital-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-ambulance"></i><br><span>ambulance</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-medkit"></i><br><span>medkit</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-fighter-jet"></i><br><span>fighter-jet</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-beer"></i><br><span>beer</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-h-square"></i><br><span>h-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-plus-square"></i><br><span>plus-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-angle-double-left"></i><br><span>angle-double-left</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-angle-double-right"></i><br><span>angle-double-right</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-angle-double-up"></i><br><span>angle-double-up</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-angle-double-down"></i><br><span>angle-double-down</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-angle-left"></i><br><span>angle-left</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-angle-right"></i><br><span>angle-right</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-angle-up"></i><br><span>angle-up</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-angle-down"></i><br><span>angle-down</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-desktop"></i><br><span>desktop</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-laptop"></i><br><span>laptop</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-tablet"></i><br><span>tablet</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-mobile"></i><br><span>mobile</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-mobile-phone"></i><br><span>mobile-phone</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-circle-o"></i><br><span>circle-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-quote-left"></i><br><span>quote-left</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-quote-right"></i><br><span>quote-right</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-spinner"></i><br><span>spinner</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-circle"></i><br><span>circle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-mail-reply"></i><br><span>mail-reply</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-reply"></i><br><span>reply</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-github-alt"></i><br><span>github-alt</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-folder-o"></i><br><span>folder-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-folder-open-o"></i><br><span>folder-open-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-smile-o"></i><br><span>smile-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-frown-o"></i><br><span>frown-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-meh-o"></i><br><span>meh-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-gamepad"></i><br><span>gamepad</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-keyboard-o"></i><br><span>keyboard-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-flag-o"></i><br><span>flag-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-flag-checkered"></i><br><span>flag-checkered</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-terminal"></i><br><span>terminal</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-code"></i><br><span>code</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-mail-reply-all"></i><br><span>mail-reply-all</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-reply-all"></i><br><span>reply-all</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-star-half-empty"></i><br><span>star-half-empty</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-star-half-full"></i><br><span>star-half-full</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-star-half-o"></i><br><span>star-half-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-location-arrow"></i><br><span>location-arrow</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-crop"></i><br><span>crop</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-code-fork"></i><br><span>code-fork</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-chain-broken"></i><br><span>chain-broken</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-unlink"></i><br><span>unlink</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-info"></i><br><span>info</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-exclamation"></i><br><span>exclamation</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-superscript"></i><br><span>superscript</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-subscript"></i><br><span>subscript</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-eraser"></i><br><span>eraser</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-puzzle-piece"></i><br><span>puzzle-piece</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-microphone"></i><br><span>microphone</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-microphone-slash"></i><br><span>microphone-slash</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-shield"></i><br><span>shield</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-calendar-o"></i><br><span>calendar-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-fire-extinguisher"></i><br><span>fire-extinguisher</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-rocket"></i><br><span>rocket</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-maxcdn"></i><br><span>maxcdn</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-chevron-circle-left"></i><br><span>chevron-circle-left</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-chevron-circle-right"></i><br><span>chevron-circle-right</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-chevron-circle-up"></i><br><span>chevron-circle-up</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-chevron-circle-down"></i><br><span>chevron-circle-down</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-html5"></i><br><span>html5</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-css3"></i><br><span>css3</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-anchor"></i><br><span>anchor</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-unlock-alt"></i><br><span>unlock-alt</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bullseye"></i><br><span>bullseye</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-ellipsis-h"></i><br><span>ellipsis-h</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-ellipsis-v"></i><br><span>ellipsis-v</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-rss-square"></i><br><span>rss-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-play-circle"></i><br><span>play-circle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-ticket"></i><br><span>ticket</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-minus-square"></i><br><span>minus-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-minus-square-o"></i><br><span>minus-square-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-level-up"></i><br><span>level-up</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-level-down"></i><br><span>level-down</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-check-square"></i><br><span>check-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-pencil-square"></i><br><span>pencil-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-external-link-square"></i><br><span>external-link-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-share-square"></i><br><span>share-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-compass"></i><br><span>compass</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-caret-square-o-down"></i><br><span>caret-square-o-down</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-toggle-down"></i><br><span>toggle-down</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-caret-square-o-up"></i><br><span>caret-square-o-up</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-toggle-up"></i><br><span>toggle-up</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-caret-square-o-right"></i><br><span>caret-square-o-right</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-toggle-right"></i><br><span>toggle-right</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-eur"></i><br><span>eur</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-euro"></i><br><span>euro</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-gbp"></i><br><span>gbp</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-dollar"></i><br><span>dollar</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-usd"></i><br><span>usd</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-inr"></i><br><span>inr</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-rupee"></i><br><span>rupee</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cny"></i><br><span>cny</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-jpy"></i><br><span>jpy</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-rmb"></i><br><span>rmb</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-yen"></i><br><span>yen</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-rouble"></i><br><span>rouble</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-rub"></i><br><span>rub</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-ruble"></i><br><span>ruble</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-krw"></i><br><span>krw</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-won"></i><br><span>won</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bitcoin"></i><br><span>bitcoin</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-btc"></i><br><span>btc</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-file"></i><br><span>file</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-file-text"></i><br><span>file-text</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sort-alpha-asc"></i><br><span>sort-alpha-asc</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sort-alpha-desc"></i><br><span>sort-alpha-desc</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sort-amount-asc"></i><br><span>sort-amount-asc</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sort-amount-desc"></i><br><span>sort-amount-desc</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sort-numeric-asc"></i><br><span>sort-numeric-asc</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sort-numeric-desc"></i><br><span>sort-numeric-desc</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-thumbs-up"></i><br><span>thumbs-up</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-thumbs-down"></i><br><span>thumbs-down</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-youtube-square"></i><br><span>youtube-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-youtube"></i><br><span>youtube</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-xing"></i><br><span>xing</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-xing-square"></i><br><span>xing-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-youtube-play"></i><br><span>youtube-play</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-dropbox"></i><br><span>dropbox</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-stack-overflow"></i><br><span>stack-overflow</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-instagram"></i><br><span>instagram</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-flickr"></i><br><span>flickr</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-adn"></i><br><span>adn</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bitbucket"></i><br><span>bitbucket</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bitbucket-square"></i><br><span>bitbucket-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-tumblr"></i><br><span>tumblr</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-tumblr-square"></i><br><span>tumblr-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-long-arrow-down"></i><br><span>long-arrow-down</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-long-arrow-up"></i><br><span>long-arrow-up</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-long-arrow-left"></i><br><span>long-arrow-left</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-long-arrow-right"></i><br><span>long-arrow-right</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-apple"></i><br><span>apple</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-windows"></i><br><span>windows</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-android"></i><br><span>android</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-linux"></i><br><span>linux</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-dribbble"></i><br><span>dribbble</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-skype"></i><br><span>skype</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-foursquare"></i><br><span>foursquare</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-trello"></i><br><span>trello</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-female"></i><br><span>female</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-male"></i><br><span>male</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-gittip"></i><br><span>gittip</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-gratipay"></i><br><span>gratipay</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sun-o"></i><br><span>sun-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-moon-o"></i><br><span>moon-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-archive"></i><br><span>archive</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bug"></i><br><span>bug</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-vk"></i><br><span>vk</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-weibo"></i><br><span>weibo</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-renren"></i><br><span>renren</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-pagelines"></i><br><span>pagelines</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-stack-exchange"></i><br><span>stack-exchange</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-arrow-circle-o-right"></i><br><span>arrow-circle-o-right</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-arrow-circle-o-left"></i><br><span>arrow-circle-o-left</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-caret-square-o-left"></i><br><span>caret-square-o-left</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-toggle-left"></i><br><span>toggle-left</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-dot-circle-o"></i><br><span>dot-circle-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-wheelchair"></i><br><span>wheelchair</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-vimeo-square"></i><br><span>vimeo-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-try"></i><br><span>try</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-turkish-lira"></i><br><span>turkish-lira</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-plus-square-o"></i><br><span>plus-square-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-space-shuttle"></i><br><span>space-shuttle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-slack"></i><br><span>slack</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-envelope-square"></i><br><span>envelope-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-wordpress"></i><br><span>wordpress</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-openid"></i><br><span>openid</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bank"></i><br><span>bank</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-institution"></i><br><span>institution</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-university"></i><br><span>university</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-graduation-cap"></i><br><span>graduation-cap</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-mortar-board"></i><br><span>mortar-board</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-yahoo"></i><br><span>yahoo</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-google"></i><br><span>google</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-reddit"></i><br><span>reddit</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-reddit-square"></i><br><span>reddit-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-stumbleupon-circle"></i><br><span>stumbleupon-circle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-stumbleupon"></i><br><span>stumbleupon</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-delicious"></i><br><span>delicious</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-digg"></i><br><span>digg</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-pied-piper-pp"></i><br><span>pied-piper-pp</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-pied-piper-alt"></i><br><span>pied-piper-alt</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-drupal"></i><br><span>drupal</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-joomla"></i><br><span>joomla</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-language"></i><br><span>language</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-fax"></i><br><span>fax</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-building"></i><br><span>building</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-child"></i><br><span>child</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-paw"></i><br><span>paw</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-spoon"></i><br><span>spoon</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cube"></i><br><span>cube</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cubes"></i><br><span>cubes</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-behance"></i><br><span>behance</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-behance-square"></i><br><span>behance-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-steam"></i><br><span>steam</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-steam-square"></i><br><span>steam-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-recycle"></i><br><span>recycle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-automobile"></i><br><span>automobile</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-car"></i><br><span>car</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cab"></i><br><span>cab</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-taxi"></i><br><span>taxi</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-tree"></i><br><span>tree</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-spotify"></i><br><span>spotify</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-deviantart"></i><br><span>deviantart</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-soundcloud"></i><br><span>soundcloud</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-database"></i><br><span>database</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-file-pdf-o"></i><br><span>file-pdf-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-file-word-o"></i><br><span>file-word-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-file-excel-o"></i><br><span>file-excel-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-file-powerpoint-o"></i><br><span>file-powerpoint-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-file-image-o"></i><br><span>file-image-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-file-photo-o"></i><br><span>file-photo-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-file-picture-o"></i><br><span>file-picture-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-file-archive-o"></i><br><span>file-archive-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-file-zip-o"></i><br><span>file-zip-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-file-audio-o"></i><br><span>file-audio-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-file-sound-o"></i><br><span>file-sound-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-file-movie-o"></i><br><span>file-movie-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-file-video-o"></i><br><span>file-video-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-file-code-o"></i><br><span>file-code-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-vine"></i><br><span>vine</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-codepen"></i><br><span>codepen</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-jsfiddle"></i><br><span>jsfiddle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-life-bouy"></i><br><span>life-bouy</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-life-buoy"></i><br><span>life-buoy</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-life-ring"></i><br><span>life-ring</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-life-saver"></i><br><span>life-saver</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-support"></i><br><span>support</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-circle-o-notch"></i><br><span>circle-o-notch</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-ra"></i><br><span>ra</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-rebel"></i><br><span>rebel</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-resistance"></i><br><span>resistance</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-empire"></i><br><span>empire</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-ge"></i><br><span>ge</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-git-square"></i><br><span>git-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-git"></i><br><span>git</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hacker-news"></i><br><span>hacker-news</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-y-combinator-square"></i><br><span>y-combinator-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-yc-square"></i><br><span>yc-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-tencent-weibo"></i><br><span>tencent-weibo</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-qq"></i><br><span>qq</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-wechat"></i><br><span>wechat</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-weixin"></i><br><span>weixin</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-paper-plane"></i><br><span>paper-plane</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-send"></i><br><span>send</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-paper-plane-o"></i><br><span>paper-plane-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-send-o"></i><br><span>send-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-history"></i><br><span>history</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-circle-thin"></i><br><span>circle-thin</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-header"></i><br><span>header</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-paragraph"></i><br><span>paragraph</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sliders"></i><br><span>sliders</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-share-alt"></i><br><span>share-alt</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-share-alt-square"></i><br><span>share-alt-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bomb"></i><br><span>bomb</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-futbol-o"></i><br><span>futbol-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-soccer-ball-o"></i><br><span>soccer-ball-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-tty"></i><br><span>tty</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-binoculars"></i><br><span>binoculars</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-plug"></i><br><span>plug</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-slideshare"></i><br><span>slideshare</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-twitch"></i><br><span>twitch</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-yelp"></i><br><span>yelp</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-newspaper-o"></i><br><span>newspaper-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-wifi"></i><br><span>wifi</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-calculator"></i><br><span>calculator</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-paypal"></i><br><span>paypal</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-google-wallet"></i><br><span>google-wallet</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cc-visa"></i><br><span>cc-visa</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cc-mastercard"></i><br><span>cc-mastercard</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cc-discover"></i><br><span>cc-discover</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cc-amex"></i><br><span>cc-amex</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cc-paypal"></i><br><span>cc-paypal</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cc-stripe"></i><br><span>cc-stripe</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bell-slash"></i><br><span>bell-slash</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bell-slash-o"></i><br><span>bell-slash-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-trash"></i><br><span>trash</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-copyright"></i><br><span>copyright</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-at"></i><br><span>at</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-eyedropper"></i><br><span>eyedropper</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-paint-brush"></i><br><span>paint-brush</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-birthday-cake"></i><br><span>birthday-cake</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-area-chart"></i><br><span>area-chart</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-pie-chart"></i><br><span>pie-chart</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-line-chart"></i><br><span>line-chart</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-lastfm"></i><br><span>lastfm</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-lastfm-square"></i><br><span>lastfm-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-toggle-off"></i><br><span>toggle-off</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-toggle-on"></i><br><span>toggle-on</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bicycle"></i><br><span>bicycle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bus"></i><br><span>bus</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-ioxhost"></i><br><span>ioxhost</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-angellist"></i><br><span>angellist</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cc"></i><br><span>cc</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-ils"></i><br><span>ils</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-shekel"></i><br><span>shekel</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sheqel"></i><br><span>sheqel</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-meanpath"></i><br><span>meanpath</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-buysellads"></i><br><span>buysellads</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-connectdevelop"></i><br><span>connectdevelop</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-dashcube"></i><br><span>dashcube</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-forumbee"></i><br><span>forumbee</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-leanpub"></i><br><span>leanpub</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sellsy"></i><br><span>sellsy</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-shirtsinbulk"></i><br><span>shirtsinbulk</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-simplybuilt"></i><br><span>simplybuilt</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-skyatlas"></i><br><span>skyatlas</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cart-plus"></i><br><span>cart-plus</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cart-arrow-down"></i><br><span>cart-arrow-down</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-diamond"></i><br><span>diamond</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-ship"></i><br><span>ship</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-user-secret"></i><br><span>user-secret</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-motorcycle"></i><br><span>motorcycle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-street-view"></i><br><span>street-view</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-heartbeat"></i><br><span>heartbeat</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-venus"></i><br><span>venus</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-mars"></i><br><span>mars</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-mercury"></i><br><span>mercury</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-intersex"></i><br><span>intersex</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-transgender"></i><br><span>transgender</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-transgender-alt"></i><br><span>transgender-alt</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-venus-double"></i><br><span>venus-double</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-mars-double"></i><br><span>mars-double</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-venus-mars"></i><br><span>venus-mars</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-mars-stroke"></i><br><span>mars-stroke</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-mars-stroke-v"></i><br><span>mars-stroke-v</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-mars-stroke-h"></i><br><span>mars-stroke-h</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-neuter"></i><br><span>neuter</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-genderless"></i><br><span>genderless</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-facebook-official"></i><br><span>facebook-official</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-pinterest-p"></i><br><span>pinterest-p</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-whatsapp"></i><br><span>whatsapp</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-server"></i><br><span>server</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-user-plus"></i><br><span>user-plus</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-user-times"></i><br><span>user-times</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bed"></i><br><span>bed</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hotel"></i><br><span>hotel</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-viacoin"></i><br><span>viacoin</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-train"></i><br><span>train</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-subway"></i><br><span>subway</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-medium"></i><br><span>medium</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-y-combinator"></i><br><span>y-combinator</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-yc"></i><br><span>yc</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-optin-monster"></i><br><span>optin-monster</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-opencart"></i><br><span>opencart</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-expeditedssl"></i><br><span>expeditedssl</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-battery"></i><br><span>battery</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-battery-4"></i><br><span>battery-4</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-battery-full"></i><br><span>battery-full</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-battery-3"></i><br><span>battery-3</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-battery-three-quarters"></i><br><span>battery-three-quarters</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-battery-2"></i><br><span>battery-2</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-battery-half"></i><br><span>battery-half</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-battery-1"></i><br><span>battery-1</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-battery-quarter"></i><br><span>battery-quarter</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-battery-0"></i><br><span>battery-0</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-battery-empty"></i><br><span>battery-empty</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-mouse-pointer"></i><br><span>mouse-pointer</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-i-cursor"></i><br><span>i-cursor</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-object-group"></i><br><span>object-group</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-object-ungroup"></i><br><span>object-ungroup</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sticky-note"></i><br><span>sticky-note</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sticky-note-o"></i><br><span>sticky-note-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cc-jcb"></i><br><span>cc-jcb</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-cc-diners-club"></i><br><span>cc-diners-club</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-clone"></i><br><span>clone</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-balance-scale"></i><br><span>balance-scale</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hourglass-o"></i><br><span>hourglass-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hourglass-1"></i><br><span>hourglass-1</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hourglass-start"></i><br><span>hourglass-start</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hourglass-2"></i><br><span>hourglass-2</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hourglass-half"></i><br><span>hourglass-half</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hourglass-3"></i><br><span>hourglass-3</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hourglass-end"></i><br><span>hourglass-end</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hourglass"></i><br><span>hourglass</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hand-grab-o"></i><br><span>hand-grab-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hand-rock-o"></i><br><span>hand-rock-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hand-paper-o"></i><br><span>hand-paper-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hand-stop-o"></i><br><span>hand-stop-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hand-scissors-o"></i><br><span>hand-scissors-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hand-lizard-o"></i><br><span>hand-lizard-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hand-spock-o"></i><br><span>hand-spock-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hand-pointer-o"></i><br><span>hand-pointer-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hand-peace-o"></i><br><span>hand-peace-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-trademark"></i><br><span>trademark</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-registered"></i><br><span>registered</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-creative-commons"></i><br><span>creative-commons</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-gg"></i><br><span>gg</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-gg-circle"></i><br><span>gg-circle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-tripadvisor"></i><br><span>tripadvisor</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-odnoklassniki"></i><br><span>odnoklassniki</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-odnoklassniki-square"></i><br><span>odnoklassniki-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-get-pocket"></i><br><span>get-pocket</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-wikipedia-w"></i><br><span>wikipedia-w</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-safari"></i><br><span>safari</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-chrome"></i><br><span>chrome</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-firefox"></i><br><span>firefox</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-opera"></i><br><span>opera</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-internet-explorer"></i><br><span>internet-explorer</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-television"></i><br><span>television</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-tv"></i><br><span>tv</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-contao"></i><br><span>contao</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-500px"></i><br><span>500px</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-amazon"></i><br><span>amazon</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-calendar-plus-o"></i><br><span>calendar-plus-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-calendar-minus-o"></i><br><span>calendar-minus-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-calendar-times-o"></i><br><span>calendar-times-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-calendar-check-o"></i><br><span>calendar-check-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-industry"></i><br><span>industry</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-map-pin"></i><br><span>map-pin</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-map-signs"></i><br><span>map-signs</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-map-o"></i><br><span>map-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-map"></i><br><span>map</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-commenting"></i><br><span>commenting</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-commenting-o"></i><br><span>commenting-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-houzz"></i><br><span>houzz</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-vimeo"></i><br><span>vimeo</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-black-tie"></i><br><span>black-tie</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-fonticons"></i><br><span>fonticons</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-reddit-alien"></i><br><span>reddit-alien</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-edge"></i><br><span>edge</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-credit-card-alt"></i><br><span>credit-card-alt</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-codiepie"></i><br><span>codiepie</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-modx"></i><br><span>modx</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-fort-awesome"></i><br><span>fort-awesome</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-usb"></i><br><span>usb</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-product-hunt"></i><br><span>product-hunt</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-mixcloud"></i><br><span>mixcloud</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-scribd"></i><br><span>scribd</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-pause-circle"></i><br><span>pause-circle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-pause-circle-o"></i><br><span>pause-circle-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-stop-circle"></i><br><span>stop-circle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-stop-circle-o"></i><br><span>stop-circle-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-shopping-bag"></i><br><span>shopping-bag</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-shopping-basket"></i><br><span>shopping-basket</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hashtag"></i><br><span>hashtag</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bluetooth"></i><br><span>bluetooth</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bluetooth-b"></i><br><span>bluetooth-b</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-percent"></i><br><span>percent</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-gitlab"></i><br><span>gitlab</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-wpbeginner"></i><br><span>wpbeginner</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-wpforms"></i><br><span>wpforms</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-envira"></i><br><span>envira</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-universal-access"></i><br><span>universal-access</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-wheelchair-alt"></i><br><span>wheelchair-alt</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-question-circle-o"></i><br><span>question-circle-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-blind"></i><br><span>blind</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-audio-description"></i><br><span>audio-description</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-volume-control-phone"></i><br><span>volume-control-phone</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-braille"></i><br><span>braille</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-assistive-listening-systems"></i><br><span>assistive-listening-systems</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-american-sign-language-interpreting"></i><br><span>american-sign-language-interpreting</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-asl-interpreting"></i><br><span>asl-interpreting</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-deaf"></i><br><span>deaf</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-deafness"></i><br><span>deafness</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-hard-of-hearing"></i><br><span>hard-of-hearing</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-glide"></i><br><span>glide</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-glide-g"></i><br><span>glide-g</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-sign-language"></i><br><span>sign-language</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-signing"></i><br><span>signing</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-low-vision"></i><br><span>low-vision</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-viadeo"></i><br><span>viadeo</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-viadeo-square"></i><br><span>viadeo-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-snapchat"></i><br><span>snapchat</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-snapchat-ghost"></i><br><span>snapchat-ghost</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-snapchat-square"></i><br><span>snapchat-square</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-pied-piper"></i><br><span>pied-piper</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-first-order"></i><br><span>first-order</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-yoast"></i><br><span>yoast</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-themeisle"></i><br><span>themeisle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-google-plus-circle"></i><br><span>google-plus-circle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-google-plus-official"></i><br><span>google-plus-official</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-fa"></i><br><span>fa</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-font-awesome"></i><br><span>font-awesome</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-handshake-o"></i><br><span>handshake-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-envelope-open"></i><br><span>envelope-open</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-envelope-open-o"></i><br><span>envelope-open-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-linode"></i><br><span>linode</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-address-book"></i><br><span>address-book</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-address-book-o"></i><br><span>address-book-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-address-card"></i><br><span>address-card</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-vcard"></i><br><span>vcard</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-address-card-o"></i><br><span>address-card-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-vcard-o"></i><br><span>vcard-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-user-circle"></i><br><span>user-circle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-user-circle-o"></i><br><span>user-circle-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-user-o"></i><br><span>user-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-id-badge"></i><br><span>id-badge</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-drivers-license"></i><br><span>drivers-license</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-id-card"></i><br><span>id-card</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-drivers-license-o"></i><br><span>drivers-license-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-id-card-o"></i><br><span>id-card-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-quora"></i><br><span>quora</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-free-code-camp"></i><br><span>free-code-camp</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-telegram"></i><br><span>telegram</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-thermometer"></i><br><span>thermometer</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-thermometer-4"></i><br><span>thermometer-4</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-thermometer-full"></i><br><span>thermometer-full</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-thermometer-3"></i><br><span>thermometer-3</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-thermometer-three-quarters"></i><br><span>thermometer-three-quarters</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-thermometer-2"></i><br><span>thermometer-2</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-thermometer-half"></i><br><span>thermometer-half</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-thermometer-1"></i><br><span>thermometer-1</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-thermometer-quarter"></i><br><span>thermometer-quarter</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-thermometer-0"></i><br><span>thermometer-0</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-thermometer-empty"></i><br><span>thermometer-empty</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-shower"></i><br><span>shower</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bath"></i><br><span>bath</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bathtub"></i><br><span>bathtub</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-s15"></i><br><span>s15</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-podcast"></i><br><span>podcast</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-window-maximize"></i><br><span>window-maximize</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-window-minimize"></i><br><span>window-minimize</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-window-restore"></i><br><span>window-restore</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-times-rectangle"></i><br><span>times-rectangle</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-window-close"></i><br><span>window-close</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-times-rectangle-o"></i><br><span>times-rectangle-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-window-close-o"></i><br><span>window-close-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-bandcamp"></i><br><span>bandcamp</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-grav"></i><br><span>grav</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-etsy"></i><br><span>etsy</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-imdb"></i><br><span>imdb</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-ravelry"></i><br><span>ravelry</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-eercast"></i><br><span>eercast</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-microchip"></i><br><span>microchip</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-snowflake-o"></i><br><span>snowflake-o</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-superpowers"></i><br><span>superpowers</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-wpexplorer"></i><br><span>wpexplorer</span></div>
                                <div class="col-xs-4 col-sm-3 col-md-2"><i class="icon-meetup"></i><br><span>meetup</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-xs-12"></div>
            <div class="flex-xs-12"></div>
            <div class="flex-xs-12"></div>
        </div>
    </div>
</template>

<script src="./doc.js"></script>

<style lang="scss">
    @import "./doc.scss";
</style>