import { describe, test, expect } from 'bun:test';
import { findLinearIdentifierInComment } from './github';

describe('findLinearIdentifierInComment', () => {
    test('should extract identifier from linear[bot] comment with valid URL', async () => {
        const comments = [
            {
                user: { login: 'linear[bot]' },
                body: '<p><a href="https://linear.app/preview-test/issue/PRE-7/add-functionality-for-detecting-a-linear-identifier">PRE-7 Add functionality for detecting a Linear identifier</a></p>',
            },
        ];

        const result = await findLinearIdentifierInComment(comments);

        expect(result).toBe('PRE-7');
    });

    test('should extract identifier from linear[bot] comment when multiple comments exist', async () => {
        const comments = [
            {
                user: { login: 'other-user' },
                body: 'Some other comment',
            },
            {
                user: { login: 'linear[bot]' },
                body: '<p><a href="https://linear.app/my-team/issue/TASK-123/my-task-title">TASK-123 My task title</a></p>',
            },
            {
                user: { login: 'another-user' },
                body: 'Another comment',
            },
        ];

        const result = await findLinearIdentifierInComment(comments);

        expect(result).toBe('TASK-123');
    });

    test('should return null when no linear[bot] comment exists', async () => {
        const comments = [
            {
                user: { login: 'other-user' },
                body: 'Some comment',
            },
            {
                user: { login: 'another-user' },
                body: 'Another comment',
            },
        ];

        const result = await findLinearIdentifierInComment(comments);

        expect(result).toBeNull();
    });

    test('should return null when linear[bot] comment has no link', async () => {
        const comments = [
            {
                user: { login: 'linear[bot]' },
                body: 'Some comment without a link',
            },
        ];

        const result = await findLinearIdentifierInComment(comments);

        expect(result).toBeNull();
    });
});
