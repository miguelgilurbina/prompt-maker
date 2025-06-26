# Content Moderation System

This document outlines the content moderation system used in the application to ensure safe and appropriate user-generated content.

## Overview

The moderation system consists of three main components:

1. **Input Validation** - Ensures data meets basic format requirements
2. **Rate Limiting** - Prevents abuse of the API
3. **Content Moderation** - Analyzes content for policy violations

## 1. Input Validation

### Purpose
- Ensures all prompt data meets minimum requirements before processing
- Prevents malformed data from entering the system

### Validation Rules

| Field      | Rules |
|------------|-------|
| title      | - Required<br>- 3-100 characters<br>- No HTML/JS |
| content    | - Required<br>- 10-10,000 characters |
| category   | - Must be one of: creative-writing, technical, business, academic, general, custom |
| tags       | - Optional<br>- Max 5 tags<br>- Each tag max 20 characters |
| isPublic   | - Boolean<br>- Defaults to true |


## 2. Rate Limiting

### Configuration
- **Requests**: 10 per minute per IP
- **Window**: 60 seconds
- **Methods**: Applies to all non-GET requests

### Headers
Rate limit information is included in response headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in window
- `X-RateLimit-Reset`: Unix timestamp when limit resets
- `Retry-After`: Seconds until retry is allowed (when rate limited)

## 3. Content Moderation

### Moderation Rules

#### Banned Content
- Profanity and offensive language
- Personal information (emails, phone numbers, etc.)
- Financial information (credit cards, bank accounts)
- Malicious links or scripts

#### Content Analysis
1. **Banned Words Check**
   - Matches against a list of prohibited terms
   - Case-insensitive matching
   - Full word matching (not substrings)

2. **Suspicious Patterns**
   - URLs and links
   - Email addresses
   - Credit card numbers
   - Social security numbers
   - Other personally identifiable information (PII)

3. **Content Quality**
   - Minimum length: 10 characters
   - Maximum length: 10,000 characters
   - Excessive capitalization (>50% uppercase)
   - Repetitive content

### Scoring System

Each violation adds to a score. If the total score exceeds the threshold (0.7), the content is rejected.

| Violation | Score |
|-----------|-------|
| Banned word | +0.5 |
| Suspicious pattern | +0.3 |
| Length violation | +0.2 |
| Excessive caps | +0.2 |


## Implementation Details

### Files

```
src/
  lib/
    validators/
      prompt.validator.ts    # Input validation
    middleware/
      rateLimit.ts           # Rate limiting
    moderation/
      contentModerator.ts    # Content analysis
```

### Adding New Banned Terms

1. Edit `contentModerator.ts`
2. Add terms to the `BANNED_WORDS` array
3. Add tests for the new terms
4. Update this documentation if needed

### Testing

Run the test suite to verify all moderation rules:

```bash
npm test
```

## Best Practices

1. **False Positives**
   - Review moderation logs regularly
   - Adjust scoring thresholds as needed
   - Consider adding an appeal process

2. **Performance**
   - Keep banned words list optimized
   - Use efficient regex patterns
   - Consider caching frequent checks

3. **Privacy**
   - Don't log sensitive information
   - Anonymize data in logs
   - Comply with data protection regulations

## Monitoring and Maintenance

1. **Logging**
   - Log all moderation actions
   - Include reason and score for rejections
   - Monitor for false positives/negatives

2. **Metrics**
   - Track moderation statistics
   - Monitor rate limit hits
   - Measure average processing time

3. **Review Process**
   - Regularly review moderation effectiveness
   - Update rules based on new patterns
   - Document any changes to the system

## Troubleshooting

### Common Issues

| Issue | Possible Cause | Solution |
|-------|----------------|-----------|
| False positives | Overly strict rules | Adjust scoring or rules |
| False negatives | Missing patterns | Update banned terms/patterns |
| Performance issues | Inefficient regex | Optimize patterns |

### Getting Help

For issues with the moderation system, contact the development team with:
- Example content causing issues
- Expected vs actual behavior
- Any relevant logs or error messages
