<?php

use App\Enums\UserRole;
use App\Models\User;

test('guests cannot visit users page', function () {
    $this->get(route('users.index'))->assertRedirect(route('login'));
});

test('authenticated users can view users list', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('users.index'))
        ->assertOk();
});

test('users can be created', function () {
    $user = User::factory()->create(['role' => UserRole::Admin]);

    $this->actingAs($user)
        ->post(route('users.store'), [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'role' => UserRole::User->value,
            'password' => 'password123',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('users', ['email' => 'newuser@example.com']);
});
