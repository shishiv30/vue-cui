<template>
    <div class="page-dev-ui" v-inital v-fullscreen>
        <div class="flex-gs-fixed">
            <div class="flex-xs-12">
                <div class="section">
                    <h2 class="h2">Typograph</h2>
                    <div class="panel">
                        <div class="h3">Typograph text</div>
                        <div>
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
                        <div class="h3">Typograph title</div>
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
                        <div class="h3">Typograph paragraph</div>
                        <div class="paragraph">A specimen sheet of the Trajan typeface, which is based on the letter forms of capitalis monumentalis or Roman square capitals used for the inscription at the base of Trajan's Column, from which the typeface takes its name Movable type being assembled on a composing stick using pieces that are stored in the type case shown below it Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing (leading), and letter-spacing (tracking), and adjusting the space between pairs of letters (kerning[1]). The term typography is also applied to the style, arrangement, and appearance of the letters, numbers, and symbols created by the process. Type design is a closely related craft, sometimes considered part of typography; most typographers do not design typefaces, and some type designers do not consider themselves typographers.[2][3] Typography also may be used as a decorative device, unrelated to communication of information.
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-xs-12">
                <div class="section">
                    <h2 class="h2">Form</h2>
                    <div class="panel">
                        <div class="h3">Form button</div>
                        <div class="gs">
                            <div class="row">
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn default" href="javascript:void(0)"><i class="icon-square"></i> <span>Default Button</span> </a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn default active" href="javascript:void(0)"><i class="icon-check-square"></i> Default Button</a>
                                </div>

                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn link" href="javascript:void(0)"><i class="icon-link"></i> Link Button</a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn link active" href="javascript:void(0)"><i class="icon-link"></i> Link Button</a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn submit" href="javascript:void(0)"><i class="icon-square"></i> Submit Button</a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn submit active" href="javascript:void(0)"><i class="icon-check-square"></i> Submit Button</a>
                                </div>

                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn default loading" href="javascript:void(0)"><i class="icon-clock"></i> loading...</a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn default" href="javascript:void(0)" disabled><i class="icon-lock"></i> Disable Button</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel">
                        <div class="h3">Form button small</div>
                        <div class="gs">
                            <div class="row">
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn small default" href="javascript:void(0)"> Default Button <i class="icon-times"></i></a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn small default active" href="javascript:void(0)"><i class="icon-check-square"></i> Default Button</a>
                                </div>

                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn link small" href="javascript:void(0)"><i class="icon-link"></i> Link Button</a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn link small active" href="javascript:void(0)"><i class="icon-link"></i> Link Button</a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn small submit" href="javascript:void(0)"><i class="icon-square"></i> Submit Button</a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn small submit active" href="javascript:void(0)"><i class="icon-check-square"></i> Submit Button</a>
                                </div>

                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn small default loading" href="javascript:void(0)"><i class="icon-clock"></i> loading...</a>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-3">
                                    <a class="btn small default" href="javascript:void(0)" disabled><i class="icon-lock"></i> Disable Button</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel">
                        <div class="h3">Form textbox</div>
                        <div class="gs">
                            <div class="row">
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <textbox>
                                        <div class="input left">
                                            <label>Email</label>
                                            <i class="icon-envelope"></i>
                                            <input type="email" name="phone" v-model="email" />
                                        </div>
                                    </textbox>

                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <textbox>
                                        <div class="input left">
                                            <label>Mobile Number</label>
                                            <i class="icon-phone"></i>
                                            <input type="number" name="phone" v-model="phone" />
                                        </div>
                                    </textbox>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <textbox>
                                        <div class="input left">
                                            <label>Password</label>
                                            <i class="icon-eye-slash"></i>
                                            <input type="password" name="phone" v-model="password" />
                                        </div>
                                    </textbox>
                                </div>

                                <div class="col-xs-12">
                                    <textbox>
                                        <div class="input right">
                                            <label>Search</label>
                                            <input type="text" name="search" v-model="search" />
                                            <a href="javascript:;" class="btn active"><i class="icon-search"></i></a>
                                        </div>
                                    </textbox>
                                </div>
                                <div class="col-xs-12">
                                    <textbox>
                                        <div class="textarea">
                                            <label>Comment</label>
                                            <textarea name="comment" v-model="comment" maxlength="4000"></textarea>
                                        </div>
                                    </textbox>
                                </div>
                            </div>
                        </div>
                        <div class="h3">Form textbox small </div>
                        <div class="gs">
                            <div class="row">
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <textbox>
                                        <div class="input small left">
                                            <label>Email</label>
                                            <i class="icon-envelope"></i>
                                            <input type="email" name="phone" v-model="email" />
                                        </div>
                                    </textbox>

                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <textbox>
                                        <div class="input small left">
                                            <label>Mobile Number</label>
                                            <i class="icon-phone"></i>
                                            <input type="number" name="phone" v-model="phone1" />
                                        </div>
                                    </textbox>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <textbox>
                                        <div class="input small left">
                                            <label>Password</label>
                                            <i class="icon-eye-slash"></i>
                                            <input type="password" name="phone" v-model="password1" />
                                        </div>
                                    </textbox>
                                </div>

                                <div class="col-xs-12">
                                    <textbox>
                                        <div class="input small right">
                                            <label>Search</label>
                                            <input type="text" name="search" v-model="search1" />
                                            <a href="javascript:;" class="btn active "><i class="icon-search"></i></a>
                                        </div>
                                    </textbox>
                                </div>
                                <div class="col-xs-12">
                                    <textbox>
                                        <div class="textarea">
                                            <label>Comment</label>
                                            <textarea name="comment" v-model="comment1" maxlength="4000"></textarea>
                                        </div>
                                    </textbox>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <div class="flex-xs-12"></div>
            <div class="flex-xs-12"></div>
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