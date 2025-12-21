<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('session_id')->nullable()->after('user_id');
            $table->unsignedBigInteger('product_id')->nullable()->after('session_id');
            $table->string('customer_name')->nullable()->after('product_id');
            $table->string('customer_phone')->nullable()->after('customer_name');
            $table->string('thana')->nullable()->after('customer_phone');
            $table->string('district')->nullable()->after('thana');
            $table->string('delivery_location')->nullable()->after('district');
            $table->integer('quantity')->nullable()->after('delivery_location');
            $table->json('variations')->nullable()->after('quantity');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['session_id', 'product_id', 'customer_name', 'customer_phone', 'thana', 'district', 'delivery_location', 'quantity', 'variations']);
        });
    }
};
