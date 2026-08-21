# Pi Command Center Full Course Edition

Course Engine V2 converts all ten Raspberry Pi projects into start-to-finish guided courses.

## Coverage

- 10 complete project courses
- 90 guided phases
- 90 visual phases
- 603 ordered actions
- Materials and safety guidance per project
- Raspberry Pi OS preparation before project-specific work
- Success gates and targeted troubleshooting
- Cold-boot final validation
- Maintenance and recovery notes
- Local progress, action checks, and notes
- Existing verified repository photos where available
- Generated instructional SVG renders for remaining phases

## Validation

Vercel runs `node validate-course.js` for every deployment. The validator checks JavaScript syntax, expected project IDs, course metadata, phase count, action completeness, visual coverage, success gates, warning/troubleshooting/command schemas, root shell assets, and service-worker version.

Expected build output begins with:

`COURSE_VALIDATION_OK courses=10 phases=90 visuals=90 actions=603`
