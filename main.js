var EPPZScrollTo =
{
    /**
     * Helpers.
     */
    documentVerticalScrollPosition: function()
    {
        if (self.pageYOffset) return self.pageYOffset; // Firefox, Chrome, Opera, Safari.
        if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop; // Internet Explorer 6 (standards mode).
        if (document.body.scrollTop) return document.body.scrollTop; // Internet Explorer 6, 7 and 8.
        return 0; // None of the above.
    },

    viewportHeight: function()
    { return (document.compatMode === "CSS1Compat") ? document.documentElement.clientHeight : document.body.clientHeight; },

    documentHeight: function()
    { return (document.height !== undefined) ? document.height : document.body.offsetHeight; },

    documentMaximumScrollPosition: function()
    { return this.documentHeight() - this.viewportHeight(); },

    elementVerticalClientPositionById: function(id)
    {
        var element = document.getElementById(id);
        var rectangle = element.getBoundingClientRect();
        return rectangle.top;
    },

    /**
     * Animation tick.
     */
    scrollVerticalTickToPosition: function(currentPosition, targetPosition)
    {
        var filter = 0.09;
        var fps = 60;
        var difference = parseFloat(targetPosition) - parseFloat(currentPosition);

        // Snap, then stop if arrived.
        var arrived = (Math.abs(difference) <= 5);
        if (arrived)
        {
            // Apply target.
            scrollTo(0.0, targetPosition);
            return;
        } 

        // Filtered position.
        currentPosition = (parseFloat(currentPosition) * (1.0 - filter)) + (parseFloat(targetPosition) * filter);

        // Apply target.
        scrollTo(0.0, Math.round(currentPosition));

        // Schedule next tick.
        setTimeout("EPPZScrollTo.scrollVerticalTickToPosition("+currentPosition+", "+targetPosition+")", (1000 / fps));
    },

    /**
     * For public use.
     *
     * @param id The id of the element to scroll to.
     * @param padding Top padding to apply above element.
     */
    scrollVerticalToElementById: function(id, padding)
    {
        var element = document.getElementById(id);
        if (element == null)
        {
            console.warn('Cannot find element with id \''+id+'\'.');
            return;
        }

        var targetPosition = this.documentVerticalScrollPosition() + this.elementVerticalClientPositionById(id) - padding;
        var currentPosition = this.documentVerticalScrollPosition();

        // Clamp.
        var maximumScrollPosition = this.documentMaximumScrollPosition();
        if (targetPosition > maximumScrollPosition) targetPosition = maximumScrollPosition;

        // Start animation.
        this.scrollVerticalTickToPosition(currentPosition, targetPosition);
    }
};

const swipe = document.getElementById('swipe');
var scrollBollean = false
swipe.style.display =  "none"

window.addEventListener('scroll', function() {
    
    if (window.scrollY >= 120) {
        scrollBollean = true
        swipe.style.display =  "none"
    }

})

window.onload = function() {
    setTimeout(() => {
        if (!scrollBollean) {
            swipe.style.display =  "block"
        }
    }, 10000);
}

function ScrollToContent() {
    EPPZScrollTo.scrollVerticalToElementById('content', 0)

}

const snow = new Vue({
    el: '#snow',
    data: {}
})

let selected_language = "ru";
const candidate_language = localStorage.getItem('language');
if (candidate_language) {
    selected_language = candidate_language
}

let selected_category = 1
const candidate_category = +localStorage.getItem('category');
if (candidate_category) {
    selected_category = candidate_category
}

const categories = [
    {
        page: 1,
        src: "./icons/Кальян.svg",
        ru_name: "Кальяны",
        en_name: "Hookahs"
    },
    {
        page: 2,
        src: "./icons/Снежинка.svg",
        ru_name: "Зимняя Карта",
        en_name: "Winter map"
    },
    {
        page: 3,
        src: "./icons/Горячее.svg",
        ru_name: "Горячее & Вкусняшки",
        en_name: "Hot & Yummy"
    },
    {
        page: 4,
        src: "./icons/Напитки.svg",
        ru_name: "Напитки",
        en_name: "Drinks"
    },
    {
        page: 5,
        src: "./icons/Sushimi.svg",
        ru_name: "Sushimi",
        en_name: "Sushimi"
    },
    {
        page: 6,
        src: "./icons/BroRolls.svg",
        ru_name: "BroRolls",
        en_name: "BroRolls"
    },
    {
        page: 7,
        src: "./icons/Лимонады.svg",
        ru_name: "Лимонады",
        en_name: "Lemonade"
    },
    {
        page: 8,
        src: "./icons/Когтейли.svg",
        ru_name: "Коктейли",
        en_name: "Cocktails"
    },
    {
        page: 9,
        src: "./icons/Шоты.svg",
        ru_name: "Шоты",
        en_name: "Shots"
    },
    {
        page: 10,
        src: "./icons/Крепкий Алгокголь и Пиво.svg",
        ru_name: "Крепкое & Пиво",
        en_name: "Strong & Beer"
    },
    {
        page: 11,
        src: "./icons/Снэки.svg",
        ru_name: "Снэки",
        en_name: "Snacks"
    },
    {
        page: 12,
        src: "./icons/Винная Карта.svg",
        ru_name: "Винная Карта",
        en_name: "Wine map"
    }

]


const component = new Vue({
    el: '#content',
    data: {
        language: selected_language,
        cost: "Лей",
        category: selected_category,
        categories: categories,
        main_menu: menu,
        menu: undefined
    },
    methods:{
        setLanguage(lang) {
            this.language = lang
            localStorage.setItem('language', lang);

           
            component.mapCategories();
            component.setCost();
        },
        setCost() {
            if (this.language == 'ru') {
                this.cost = "Лей"
            } else {
                this.cost = "MDL"
            }

        },
        mapCategories() {
            if (this.language === 'ru') {
                this.categories = categories.map( (item) => {
                    return {
                        page: item.page,
                        src: item.src,
                        name: item.ru_name
                    }
                } )
            } else {
                this.categories = categories.map( (item) => {
                    return {
                        page: item.page,
                        src: item.src,
                        name: item.en_name
                    }
                } )
            }
        },
        categoryColor(page){
            return this.category === page ? 'category-name red' : 'category-name'
        },
        setCategory(page) {
           this.category = page
           localStorage.setItem('category', page);

           component.setMenu();

           const el = this.$refs['menu'];
           el.scrollIntoView({behavior: 'smooth'});
           
        },
        setMenu() {
            this.menu = menu.find( item => item.page === this.category);
        }
    },
    beforeMount() {
        this.mapCategories();
        this.setCost();
        this.setMenu();
    }
})