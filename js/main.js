(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var PLACEHOLDER = "assets/placeholder.svg";

  // Image fallback: show placeholder if a local screenshot is missing
  document.querySelectorAll("img[data-fallback]").forEach(function (img) {
    function swap() {
      if (!img.src.endsWith(PLACEHOLDER)) {
        img.src = PLACEHOLDER;
      }
    }
    img.addEventListener("error", swap);
    if (img.complete && img.naturalWidth === 0) swap();
  });

  // Theme toggle
  var themeBtn = document.getElementById("theme");
  function syncTheme() {
    var light = document.documentElement.dataset.theme === "light";
    themeBtn.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
  }
  themeBtn.addEventListener("click", function () {
    var next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
    syncTheme();
  });
  syncTheme();

  // Mobile menu
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  burger.addEventListener("click", function () {
    setMenu(!menu.classList.contains("open"));
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  // Nav border on scroll
  var nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Active link + reveal
  if ("IntersectionObserver" in window) {
    var links = {};
    menu.querySelectorAll("a").forEach(function (a) {
      links[a.getAttribute("href").slice(1)] = a;
    });
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && links[en.target.id]) {
            Object.keys(links).forEach(function (k) {
              links[k].classList.remove("active");
            });
            links[en.target.id].classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("main section[id]").forEach(function (s) {
      spy.observe(s);
    });

    // Reveal replays every time an element enters or leaves the viewport (scroll up and down)
    var rev = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          var el = en.target;
          if (en.intersectionRatio >= 0.12) {
            el.style.transitionDelay = el.dataset.d || "0ms";
            el.classList.add("in");
          } else if (!en.isIntersecting) {
            el.style.transitionDelay = "0ms";
            el.classList.remove("in");
          }
        });
      },
      { threshold: [0, 0.12] },
    );
    document.querySelectorAll(".reveal").forEach(function (el) {
      rev.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("in");
    });
  }

  // Project details
  var DATA = {
    python: {
      title: "Gayanara E-Commerce Analysis (Python)",
      note: "Python approach · same dataset as the SQL version",
      desc: "An analysis of online fashion store sales using Python, done in a Jupyter Notebook. It is one half of a paired study: the same dataset is also analyzed with SQL in a separate project.",
      findings: [
        "Rp1.27 billion revenue from 2,521 valid orders, averaging Rp501,920 per order",
        "Revenue rose from early 2023 and peaked in Feb 2025 at Rp66.3 million",
        "Category and city revenue is fairly even; T-Shirt is the lowest category",
        "Promos were used on 41% of orders, but those orders were about 6% smaller in value",
        "16% of orders failed (cancelled or returned), highest with J&T and OVO, though the gaps are small",
      ],
      limits: [
        "Simulated dataset from ngulikdata.com.",
        "26% of orders are recorded before the customer's registration date.",
        "Orders with processing status are counted as revenue.",
        "Differences between couriers and payment methods are small and have not been statistically tested.",
      ],
      insightsTitle: "Recommendations",
      insights: [
        "Evaluate the promo program: the discount is small (2.4% of revenue) but does not appear to raise order value.",
        "Find out why T-Shirt is the lowest category (price, stock, or how the product is displayed).",
        "Monitor failed orders by courier and payment method before making any decision.",
      ],
      list: [
        "Data cleaning",
        "Exploratory data analysis",
        "Revenue trend identification",
        "Product category performance",
        "Promo effectiveness",
        "Failed orders",
        "Insights and business recommendations",
      ],
      tools: ["Python", "Pandas", "Matplotlib", "Jupyter Notebook"],
      url: "https://github.com/pajareeeee/gayanara_ecommerce_analysis",
    },
    sql: {
      title: "Gayanara E-Commerce Analysis (SQL)",
      note: "SQL approach · same dataset as the Python version",
      desc: "An analysis of e-commerce sales using MySQL. It is the second half of a paired study: the same dataset is also analyzed with Python in a separate project.",
      findings: [
        "Rp1.27 billion revenue from 2,521 valid orders, averaging Rp501,920 per order",
        "Highest month: Feb 2025 (Rp66.3 million)",
        "The five main categories are close together; T-Shirt is the lowest (Rp195.6 million, from item subtotals before discount)",
        "Promos were used on 41% of orders, and order value was 6% lower after discount",
        "16% of orders failed; J&T (18.4%) and OVO (18.7%) were highest",
      ],
      insights: [
        "Revenue grew: from Rp198.8 million in 2022 to Rp513.2 million in 2024. The Feb 2025 peak is the last month in the dataset, so it is unclear whether the upward trend continues.",
        "Promos did not change basket size: pre-discount basket value is nearly the same for promo and non-promo orders (Rp515,199 vs Rp513,830), so the 6% gap in net value comes purely from the discount. Total discount was Rp31.4 million (about 2.5% of revenue). The data cannot say whether promos add order volume; that needs a before-and-after comparison or an A/B test. Recommendation: measure the promo effect on order count before expanding it.",
        "Categories are nearly balanced: no single category carries the revenue. Judging which is most profitable would need margin data per category.",
        "The 16% failed-order rate is the area most worth investigating: J&T and OVO are about 4 points above the lowest (SiCepat and GoPay at 14.2%), but the gap has not been statistically tested, so it cannot be called a cause. Recommendation: break it down by status (cancelled vs returned) and by city before switching vendors or payment methods.",
        "Limitation: the dataset is simulated, so seasonality and customer behavior do not mirror a real business.",
      ],
      limits: [
        "Simulated dataset from Ngulik Data, so seasonality and customer behavior do not mirror a real business.",
        "795 of 3,000 orders (26%) are recorded before the customer's registration date; they are flagged but still used.",
        "Orders with processing status are counted as revenue (valid statuses: delivered, shipped, processing).",
        "Differences between couriers and payment methods are small and have not been statistically tested.",
      ],
      list: [
        "Data cleaning using VIEW",
        "Revenue analysis",
        "Product category analysis",
        "City performance",
        "Promo usage",
        "Patterns behind failed orders",
      ],
      tools: ["MySQL", "SQL", "Data Cleaning", "Data Analysis"],
      url: "https://github.com/pajareeeee/gayanara_sql_analysis",
      images: [
        ["assets/projects/gayanara_sql_revenue_bulanan.webp", "Monthly revenue, Jan 2022 to Feb 2025"],
        ["assets/projects/gayanara_sql_revenue_kategori.webp", "Revenue per product category"],
        ["assets/projects/gayanara_sql_order_gagal_kurir.webp", "Failed order rate per courier"],
      ],
    },
    sakumaya: {
      title: "Sakumaya Digital Bank Dashboard",
      note: "Power BI · fictional digital bank",
      desc: "A Power BI dashboard for a fictional digital bank, focused on monitoring business indicators, credit quality, customer compliance, and transaction activity.",
      findings: [
        "Compliance: 30% of customers are not yet verified (150 pending, 100 unverified, 50 rejected). 123 active accounts belong to customers with rejected or unverified KYC.",
        "Credit quality: 13.3% of loans are problematic (overdue plus written off, 40 of 300). Goods credit is highest at 22.0%, personal loans 13.3%, business capital 9.0%.",
        "Risk concentration: business capital loans are only 100 of 300 loans but make up Rp4.13 billion of the Rp6.38 billion total outstanding. Problematic outstanding is about Rp1.12 billion.",
        "Credit cards: utilization is about 47% of total limit.",
        "Transactions: 9,800 successful transactions worth Rp81.5 billion, with a 2.0% failed rate. Annual volume is nearly flat (about Rp25 to 26 billion per year in 2022 to 2024), so there is no growth story. Spending is dominated by shopping and groceries, and the mobile_app channel accounts for about 60% of transactions.",
      ],
      limits: [
        "Empty values are expected and left unfilled: referral_code (customers who signed up on their own), credit_limit_idr and outstanding_idr (non-credit cards), and last_payment_date (10 written-off loans).",
        "balance_after_idr does not follow the transaction amounts, so it is not used for balance trends.",
        "The credit transaction type mixes salary and spending, so spending is counted per merchant category (excluding transfers) instead of by transaction type.",
        "About 73% of transactions are dated before the account was created. This is typical of synthetic data and was left as is.",
        "2025 data covers only January and February, so trends and yearly comparisons should use 2022 to 2024.",
        "KYC percentages for small cities rely on very small samples (about 7 to 14 customers), so that chart is limited to cities with at least 50 customers.",
      ],
      list: [
        "Page 1: Customers & KYC",
        "Page 2: Transactions",
        "Page 3: Credit & Risk",
        "Data modeling and DAX measures",
      ],
      tools: ["Power BI", "DAX", "Data Modeling", "Data Visualization"],
      url: "https://github.com/pajareeeee/sakumaya_powerbi_dashboard",
      images: [
        ["assets/projects/sakumaya_01_nasabah_kyc.webp", "Page 1: Customers & KYC"],
        ["assets/projects/sakumaya_02_transaksi.webp", "Page 2: Transactions"],
        ["assets/projects/sakumaya_03_kredit_risiko.webp", "Page 3: Credit & Risk"],
      ],
    },
    sedukopi: {
      title: "Sedukopi Coffee Shop Sales Analysis",
      note: "Excel · fictional coffee shop chain dataset",
      desc: "An analysis of a coffee shop chain done entirely in Excel: data validation, table joins, Pivot Tables, and a one-page dashboard. It answers eight business questions about outlets, monthly trends, menu categories, peak hours, order types, payment methods, seat capacity, and staff cost.",
      findings: [
        "Revenue Rp392.9 million from 5,000 orders, with a 69.9% gross margin and an average of Rp78,581 per order",
        "Yearly revenue rose from Rp80 million (2022) to Rp140 million (2024). Highest month: Mar 2025 (Rp22.1 million); lowest: Apr 2022 (Rp4.8 million)",
        "Seven peak hours (07-08, 12-13, 17-19) bring in about 78% of revenue. 13:00 is the busiest hour and 11:00 the quietest",
        "Dine in is 50% of revenue, takeaway 30%, and delivery 20%",
        "QRIS is the biggest payment method (25.8%), followed by GoPay (24.0%) and OVO (19.7%)",
        "Food is the largest category (Rp149 million), but the margin percentage is almost the same across categories (about 70%)",
        "Highest outlet: OUT003 Senopati (Rp25.5 million); lowest: OUT020 Margonda (Rp16.0 million)",
        "Seat capacity is not related to revenue (correlation 0.08)",
      ],
      insights: [
        "Growth is partly from more outlets: active outlets grew from 12 (early 2022) to 18 (June 2023), so rising revenue does not necessarily mean each outlet is busier. The Jan to Mar 2025 jump came from order count (about 146 to 246 per month), not value per order. This needs checking and may just be a pattern of the simulated dataset.",
        "Peak hours should drive scheduling: staff schedules can focus on the three peaks (morning, lunch, evening). Promos in quiet hours are worth trying, but this data cannot say whether they would work, so they need testing first.",
        "Dine in is half of revenue, so the in-outlet experience matters most. Delivery at 20% can still grow, but the data has no delivery cost or platform commission.",
        "Profit is driven by volume, not cost price: the margin percentage is nearly the same across categories, so growing Food and Coffee sales matters more than changing cost price.",
        "More seats do not necessarily raise sales: 50-seat outlets (OUT003, OUT014) are ahead of 70-seat outlets (OUT006, OUT013).",
        "Revenue per staff member is worth reviewing: OUT008 and OUT010 have 6 staff but low revenue per staff, while OUT016 and OUT009 are highest with 3 staff. High revenue per staff could mean efficiency or understaffing; this data cannot tell which.",
      ],
      limits: [
        "Simulated dataset and only a sample of transactions (5,000 orders). Monthly staff salary per outlet is about 13 to 44 times its monthly revenue, so the salary-to-revenue ratio and profitability cannot be calculated meaningfully.",
        "Margin is gross margin (before salaries, rent, and operating costs).",
        "Outlets that opened in 2023 (OUT017, OUT019, OUT020) have shorter sales periods, so total comparisons between outlets are less fair. OUT015 and OUT018 have no orders (temporarily closed).",
        "2025 covers only three months (Jan to Mar), so do not compare it with full years.",
      ],
      list: [
        "Data validation with formulas: row counts, duplicate order IDs, empty totals, and order totals vs details",
        "A combined data sheet built with XLOOKUP, one row per item sold",
        "Pivot Tables and PivotCharts for six business questions",
        "A one-page dashboard with 4 key numbers, 8 charts, findings, and limitations",
      ],
      tools: ["Excel", "Pivot Table", "XLOOKUP", "Dashboard"],
      url: "https://github.com/pajareeeee/sedukopi_excel_analysis",
    },
  };

  var dlg = document.getElementById("detail");
  function fill(ul, items) {
    ul.innerHTML = "";
    items.forEach(function (t) {
      var li = document.createElement("li");
      li.textContent = t;
      ul.appendChild(li);
    });
  }
  document.querySelectorAll("[data-detail]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var d = DATA[btn.getAttribute("data-detail")];
      document.getElementById("d-title").textContent = d.title;
      document.getElementById("d-note").textContent = d.note;
      document.getElementById("d-desc").textContent = d.desc;
      fill(document.getElementById("d-findings"), d.findings || []);
      var ins = d.insights || [];
      fill(document.getElementById("d-insights"), ins);
      document.getElementById("d-insights").hidden = !ins.length;
      document.getElementById("d-insights-h").hidden = !ins.length;
      var lim = d.limits || [];
      fill(document.getElementById("d-limits"), lim);
      document.getElementById("d-limits").hidden = !lim.length;
      document.getElementById("d-limits-h").hidden = !lim.length;
      document.getElementById("d-insights-h").textContent = d.insightsTitle || "Insights & recommendations";
      fill(document.getElementById("d-list"), d.list);
      fill(document.getElementById("d-tools"), d.tools);
      document.getElementById("d-link").href = d.url;
      var g = document.getElementById("d-gallery");
      g.innerHTML = "";
      (d.images || []).forEach(function (im) {
        var a = document.createElement("div");
        var f = document.createElement("figure");
        var i = document.createElement("img");
        i.src = im[0];
        i.alt = im[1];
        i.loading = "lazy";
        var c = document.createElement("figcaption");
        c.textContent = im[1];
        f.appendChild(i);
        f.appendChild(c);
        a.appendChild(f);
        g.appendChild(a);
      });
      g.hidden = !(d.images && d.images.length);
      if (dlg.showModal) dlg.showModal();
      else dlg.setAttribute("open", "");
    });
  });
  document.getElementById("d-close").addEventListener("click", function () {
    dlg.close();
  });
  dlg.addEventListener("click", function (e) {
    if (e.target === dlg) dlg.close();
  });

  // Cursor spotlight on cards
  document.querySelectorAll(".card,.cert,.spot,.links li").forEach(function (el) {
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - r.left + "px");
      el.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // Stagger reveal inside grids
  document.querySelectorAll(".grid-2 .reveal,.cert-list .reveal,.edu-grid .reveal").forEach(function (el, i) {
    el.dataset.d = (i % 3) * 90 + "ms";
    el.style.transitionDelay = el.dataset.d;
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
