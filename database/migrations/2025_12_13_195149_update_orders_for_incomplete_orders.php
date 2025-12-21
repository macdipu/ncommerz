<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['thana', 'district', 'delivery_location']);
            $table->string('customer_address')->nullable()->after('customer_phone');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('customer_address');
            $table->string('thana')->nullable()->after('customer_phone');
            $table->string('district')->nullable()->after('thana');
            $table->string('delivery_location')->nullable()->after('district');
        });
    }
};
