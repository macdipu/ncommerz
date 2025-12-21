<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('incomplete_orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->string('session_id');
            $table->string('product_name');
            $table->decimal('product_price', 10, 2);
            $table->string('customer_name')->nullable();
            $table->string('customer_phone')->nullable();
            $table->string('thana')->nullable();
            $table->string('district')->nullable();
            $table->string('delivery_location')->nullable();
            $table->integer('quantity')->default(1);
            $table->json('variations')->nullable();
            $table->timestamps();
            
            $table->unique(['product_id', 'session_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('incomplete_orders');
    }
};
