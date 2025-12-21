<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('info_cards', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subtitle');
            $table->string('icon_type')->default('heroicon'); // heroicon, svg, image
            $table->text('icon_data'); // icon name or svg code
            $table->string('bg_color')->default('bg-green-50');
            $table->string('text_color')->default('text-green-600');
            $table->string('border_color')->default('border-green-200');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('info_cards');
    }
};
