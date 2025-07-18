2.3.4 / 2025-07-17
==========

  * deps: on-headers@~1.1.0
    - Fix [CVE-2025-7339](https://www.cve.org/CVERecord?id=CVE-2025-7339) ([GHSA-76c9-3jph-rj3q](https://github.com/expressjs/on-headers/security/advisories/GHSA-76c9-3jph-rj3q))

2.3.3 / 2024-10-07
==========

  * deps: depd@~2.0.0
    - Remove remove use of `eval`
  * deps: depd@~1.1.2
    - Remove unnecessary `Buffer` loading
    - perf: remove argument reassignment

2.3.2 / 2015-11-15
==================

  * deps: depd@~1.1.0
    - Enable strict mode in more places
    - Support web browser loading
  * deps: on-headers@~1.0.1
    - perf: enable strict mode
  * perf: enable strict mode

2.3.1 / 2015-05-14
==================

  * deps: depd@~1.0.1

2.3.0 / 2015-02-15
==================

  * Add function argument to support recording of response time

2.2.0 / 2014-09-22
==================

  * Add `suffix` option
  * deps: depd@~1.0.0

2.1.0 / 2014-09-16
==================

  * Add `header` option for custom header name
  * Change `digits` argument to an `options` argument

2.0.1 / 2014-08-10
==================

  * deps: on-headers@~1.0.0

2.0.0 / 2014-05-31
==================

  * add `digits` argument
  * do not override existing `X-Response-Time` header
  * timer not subject to clock drift
  * timer resolution down to nanoseconds
  * use `on-headers` module

1.0.0 / 2014-02-08
==================

  * Genesis from `connect`
