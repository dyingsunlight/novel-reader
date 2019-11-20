import UIkit from 'uikit/src/js/api/index';
import boot from 'uikit/src/js/api/boot';
import Accordion from 'uikit/src/js/core/accordion';
import Alert from 'uikit/src/js/core/alert';
import Core from 'uikit/src/js/core/core';
import Cover from 'uikit/src/js/core/cover';
import Drop from 'uikit/src/js/core/drop';
import Dropdown from 'uikit/src/js/core/dropdown';
import FormCustom from 'uikit/src/js/core/form-custom';
import Gif from 'uikit/src/js/core/gif';
import Grid from 'uikit/src/js/core/grid';
import HeightMatch from 'uikit/src/js/core/height-match';
import HeightViewport from 'uikit/src/js/core/height-viewport';
import Icon, {IconComponent, Slidenav, Search, Close, Spinner} from 'uikit/src/js/core/icon';
import Img from 'uikit/src/js/core/img';
import Leader from 'uikit/src/js/core/leader';
import Margin from 'uikit/src/js/core/margin';
import Modal from 'uikit/src/js/core/modal';
import Nav from 'uikit/src/js/core/nav';
import Navbar from 'uikit/src/js/core/navbar';
import Offcanvas from 'uikit/src/js/core/offcanvas';
import OverflowAuto from 'uikit/src/js/core/overflow-auto';
import Responsive from 'uikit/src/js/core/responsive';
import Scroll from 'uikit/src/js/core/scroll';
import Scrollspy from 'uikit/src/js/core/scrollspy';
import ScrollspyNav from 'uikit/src/js/core/scrollspy-nav';
import Sticky from 'uikit/src/js/core/sticky';
import Svg from 'uikit/src/js/core/svg';
import Switcher from 'uikit/src/js/core/switcher';
import Tab from 'uikit/src/js/core/tab';
import Toggle from 'uikit/src/js/core/toggle';
import Video from 'uikit/src/js/core/video';

// import Countdown from 'uikit/src/js/components/countdown';
// import Filter from 'uikit/src/js/components/filter';
// import Lightbox from 'uikit/src/js/components/lightbox';
// import lightboxPanel from 'uikit/src/js/components/lightbox-panel';
// import Notification from 'uikit/src/js/components/notification';
// import Parallax from 'uikit/src/js/components/parallax';
// import Slider from 'uikit/src/js/components/slider';
// import SliderParallax from 'uikit/src/js/components/slider-parallax';
// import Slideshow from 'uikit/src/js/components/slideshow';
// import SlideshowParallax from 'uikit/src/js/components/slideshow-parallax';
// import Sortable from 'uikit/src/js/components/sortable';
// import Tooltip from 'uikit/src/js/components/tooltip';
// import Upload from 'uikit/src/js/components/upload';

// UIkit.component('countdown', Countdown);
// UIkit.component('filter', Filter);
// UIkit.component('lightbox', Lightbox);
// UIkit.component('lightboxPanel', lightboxPanel);
// UIkit.component('notification', Notification);
// UIkit.component('parallax', Parallax);
// UIkit.component('slider', Slider);
// UIkit.component('sliderParallax', SliderParallax);
// UIkit.component('slideshow', Slideshow);
// UIkit.component('slideshowParallax', SlideshowParallax);
// UIkit.component('sortable', Sortable);
// UIkit.component('tooltip', Tooltip);
// UIkit.component('upload', Upload);
UIkit.component('accordion', Accordion);
UIkit.component('alert', Alert);
UIkit.component('cover', Cover);
UIkit.component('drop', Drop);
UIkit.component('dropdown', Dropdown);
UIkit.component('formCustom', FormCustom);
UIkit.component('gif', Gif);
UIkit.component('grid', Grid);
UIkit.component('heightMatch', HeightMatch);
UIkit.component('heightViewport', HeightViewport);
UIkit.component('icon', Icon);
UIkit.component('img', Img);
UIkit.component('leader', Leader);
UIkit.component('margin', Margin);
UIkit.component('modal', Modal);
UIkit.component('nav', Nav);
UIkit.component('navbar', Navbar);
UIkit.component('offcanvas', Offcanvas);
UIkit.component('overflowAuto', OverflowAuto);
UIkit.component('responsive', Responsive);
UIkit.component('scroll', Scroll);
UIkit.component('scrollspy', Scrollspy);
UIkit.component('scrollspyNav', ScrollspyNav);
UIkit.component('sticky', Sticky);
UIkit.component('svg', Svg);
UIkit.component('switcher', Switcher);
UIkit.component('tab', Tab);
UIkit.component('toggle', Toggle);
UIkit.component('video', Video);

// Icon components
UIkit.component('close', Close);
UIkit.component('marker', IconComponent);
UIkit.component('navbarToggleIcon', IconComponent);
UIkit.component('overlayIcon', IconComponent);
UIkit.component('paginationNext', IconComponent);
UIkit.component('paginationPrevious', IconComponent);
UIkit.component('searchIcon', Search);
UIkit.component('slidenavNext', Slidenav);
UIkit.component('slidenavPrevious', Slidenav);
UIkit.component('spinner', Spinner);
UIkit.component('totop', IconComponent);

// core functionality
UIkit.use(Core);
UIkit.use(() => UIkit.icon.add(true))

boot(UIkit)

export default UIkit
