    (function () {
        function initDrawer() {
            var navigation = document.querySelector('.pm-primary-navigation');
            if (!navigation) return;

            var menuToggle = navigation.querySelector('.pm-menu-toggle');
            var drawer     = navigation.querySelector('.pm-drawer');

            function openDrawer() {
                navigation.classList.add('is-open');
                document.body.classList.add('pm-drawer-open');
                if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
            }

            function closeDrawer() {
                navigation.classList.remove('is-open');
                document.body.classList.remove('pm-drawer-open');
                if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
            }

            document.addEventListener('click', function (e) {
                var target = e.target;
                if (!(target instanceof Element)) return;

                /* 1. Click on the blurry overlay background */
                if (target.classList.contains('pm-drawer-overlay')) {
                    closeDrawer();
                    return;
                }

                /* 2. Click on the Close Button */
                if (target.closest('.pm-drawer-close')) {
                    e.preventDefault();
                    closeDrawer();
                    return;
                }

                /* 3. Click on the Hamburger Toggle */
                if (target.closest('.pm-menu-toggle')) {
                    e.preventDefault();
                    if (navigation.classList.contains('is-open')) {
                        closeDrawer();
                    } else {
                        openDrawer();
                    }
                    return;
                }

                /* 4. Click outside the drawer while it is open */
                if (!navigation.classList.contains('is-open')) return;
                if (drawer && drawer.contains(target)) return;
                closeDrawer();
            });

            /* Escape key closes the drawer */
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && navigation.classList.contains('is-open')) {
                    closeDrawer();
                    if (menuToggle) menuToggle.focus();
                }
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initDrawer);
        } else {
            initDrawer();
        }
    })();